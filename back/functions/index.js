const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { format, subDays, addDays } = require("date-fns");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

// Firebase 초기화
admin.initializeApp();

exports.cleanup = onSchedule("every day 15:00", async (event) => {
  const schedRef = admin.firestore().collection("schedules");
  const notiRef = admin.firestore().collection("notifications");

  try {
    const today = format(new Date(), "yyyy-MM-dd");
    const notiExpDate = subDays(new Date(), 30); // 알림 유효기간 30일

    // 스케줄 컬렉션에서 오늘 이전의 스케줄만 가져옴
    const schedSnap = await schedRef.where("date", "<=", today).get();

    const batch = admin.firestore().batch();

    // 스케줄 정리 작업
    if (!schedSnap.empty) {
      for (const schedDoc of schedSnap.docs) {
        const schedData = schedDoc.data();
        const { memberId, trainerId } = schedData;

        logger.info(
          `Processing schedule ${schedDoc.id} for member ${memberId} and trainer ${trainerId}`
        );

        // 해당 스케줄에 일치하는 membership 문서를 찾아 처리
        const membershipQuery = await admin
          .firestore()
          .collection("memberships")
          .where("memberId", "==", memberId)
          .where("trainerId", "==", trainerId)
          .limit(1)
          .get();

        if (membershipQuery.empty) {
          logger.error(
            `No membership found for member ${memberId} and trainer ${trainerId}`
          );
          continue;
        }

        const membershipDoc = membershipQuery.docs[0].ref;

        // 배치에 스케줄 삭제와 membership 업데이트 작업 추가
        batch.delete(schedDoc.ref);
        batch.update(membershipDoc, {
          remaining: admin.firestore.FieldValue.increment(-1),
        });

        logger.info(
          `Deleted schedule ${schedDoc.id} and updated remaining for member ${memberId}`
        );
      }
    }

    // 알림 정리 작업: 생성일 기준 30일 이상 지난 알림 삭제
    const notiSnap = await notiRef.where("createdAt", "<=", notiExpDate).get();

    if (!notiSnap.empty) {
      for (const notiDoc of notiSnap.docs) {
        batch.delete(notiDoc.ref);
        logger.info(
          `Deleted notification ${notiDoc.id} created on ${notiDoc.data().createdAt
          }`
        );
      }
    } else {
      logger.info("No notifications to delete.");
    }

    // 모든 작업을 완료한 후 배치 커밋
    await batch.commit();
    logger.info("Cleanup for schedules and notifications successful");
  } catch (error) {
    logger.error("Error during cleanup:", error);
  }
});

/**
 * 회원권 잔여횟수 차감 (Callable Function)
 * - Firestore Transaction으로 원자적 처리
 */
exports.decreaseMembershipCount = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "인증이 필요합니다.");
  }

  const { trainerId, memberId } = request.data;
  if (!trainerId || !memberId) {
    throw new HttpsError("invalid-argument", "trainerId와 memberId가 필요합니다.");
  }

  const db = admin.firestore();
  const membershipSnap = await db
    .collection("memberships")
    .where("trainerId", "==", trainerId)
    .where("memberId", "==", memberId)
    .limit(1)
    .get();

  if (membershipSnap.empty) {
    throw new HttpsError("not-found", "회원권이 존재하지 않습니다.");
  }

  const membershipRef = membershipSnap.docs[0].ref;

  const result = await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(membershipRef);
    const currentRemaining = doc.data().remaining;

    if (currentRemaining <= 0) {
      return { remaining: 0, status: "expired" };
    }

    const newRemaining = currentRemaining - 1;
    const updateData = { remaining: newRemaining };
    if (newRemaining === 0) updateData.status = "expired";

    transaction.update(membershipRef, updateData);
    return { remaining: newRemaining, status: updateData.status || "active" };
  });

  logger.info(`회원권 차감: trainer=${trainerId}, member=${memberId}, remaining=${result.remaining}`);
  return result;
});

/**
 * 회원권 연장 (Callable Function)
 * - Transaction으로 remaining, count 업데이트
 */
exports.extendMembership = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "인증이 필요합니다.");
  }

  const { membershipId, additionalCount, membership } = request.data;
  if (!membershipId || !additionalCount) {
    throw new HttpsError("invalid-argument", "필수 파라미터가 누락되었습니다.");
  }

  const db = admin.firestore();
  const membershipRef = db.collection("memberships").doc(membershipId);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(membershipRef);
    if (!doc.exists) {
      throw new HttpsError("not-found", "회원권이 존재하지 않습니다.");
    }

    transaction.update(membershipRef, {
      status: "active",
      count: admin.firestore.FieldValue.increment(additionalCount),
      remaining: admin.firestore.FieldValue.increment(additionalCount),
    });
  });

  // 새 일정 생성
  const { trainerId, memberId, schedules, endDate } = membership;
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const checkedDays = schedules.map((s) => dayNames.indexOf(s.day));
  let currentDate = new Date(
    format(max([addDays(new Date(endDate), 1), new Date()]), "yyyy-MM-dd")
  );
  const batch = db.batch();

  for (let i = 0; i < additionalCount; i++) {
    while (!checkedDays.includes(currentDate.getDay())) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const scheduleForDay = schedules.find(
      (s) => s.day === dayNames[currentDate.getDay()]
    );
    if (scheduleForDay) {
      batch.set(db.collection("schedules").doc(), {
        date: format(currentDate, "yyyy-MM-dd"),
        startTime: scheduleForDay.startTime,
        trainerId,
        memberId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  await batch.commit();
  const newEndDate = format(currentDate, "yyyy-MM-dd");
  await membershipRef.update({ endDate: newEndDate });

  logger.info(`회원권 연장: id=${membershipId}, count=${additionalCount}`);
  return { endDate: newEndDate };
});

/**
 * 회원권 재개 (Callable Function)
 */
exports.resumeMembership = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "인증이 필요합니다.");
  }

  const { membershipId, memberId } = request.data;
  if (!membershipId || !memberId) {
    throw new HttpsError("invalid-argument", "필수 파라미터가 누락되었습니다.");
  }

  const db = admin.firestore();
  const membershipRef = db.collection("memberships").doc(membershipId);

  const membershipData = await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(membershipRef);
    if (!doc.exists) {
      throw new HttpsError("not-found", "회원권이 존재하지 않습니다.");
    }

    const startDate = format(new Date(), "yyyy-MM-dd");
    transaction.update(membershipRef, { status: "active", startDate });

    return { ...doc.data(), id: doc.id, startDate };
  });

  // 일정 재생성
  const { trainerId, remaining, schedules } = membershipData;
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const checkedDays = schedules.map((s) => dayNames.indexOf(s.day));
  let currentDate = new Date(membershipData.startDate);
  const batch = db.batch();

  for (let i = 0; i < remaining; i++) {
    while (!checkedDays.includes(currentDate.getDay())) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const scheduleForDay = schedules.find(
      (s) => s.day === dayNames[currentDate.getDay()]
    );
    if (scheduleForDay) {
      batch.set(db.collection("schedules").doc(), {
        date: format(currentDate, "yyyy-MM-dd"),
        startTime: scheduleForDay.startTime,
        trainerId,
        memberId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  await batch.commit();
  const newEndDate = format(currentDate, "yyyy-MM-dd");
  await membershipRef.update({ endDate: newEndDate });

  logger.info(`회원권 재개: id=${membershipId}`);
  return { status: "active", endDate: newEndDate };
});

/**
 * 회원권 생성 (Callable Function)
 */
exports.createMembership = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "인증이 필요합니다.");
  }

  const { membership } = request.data;
  if (!membership) {
    throw new HttpsError("invalid-argument", "회원권 정보가 필요합니다.");
  }

  const db = admin.firestore();
  const docRef = await db.collection("memberships").add({
    ...membership,
    remaining: membership.count,
    status: "active",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  logger.info(`회원권 생성: id=${docRef.id}`);
  return { id: docRef.id };
});

/**
 * 회원권 업데이트 (Callable Function)
 */
exports.updateMembership = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "인증이 필요합니다.");
  }

  const { membershipId, updateField } = request.data;
  if (!membershipId || !updateField) {
    throw new HttpsError("invalid-argument", "필수 파라미터가 누락되었습니다.");
  }

  await admin.firestore().collection("memberships").doc(membershipId).update(updateField);
  return { success: true };
});

/**
 * 회원권 기반 일정 생성 (Callable Function)
 */
exports.createSchedulesWithMembership = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "인증이 필요합니다.");
  }

  const { membership } = request.data;
  const { trainerId, memberId, remaining, startDate, schedules, id } = membership;

  const db = admin.firestore();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const checkedDays = schedules.map((s) => dayNames.indexOf(s.day));
  let currentDate = new Date(startDate);
  const batch = db.batch();

  for (let i = 0; i < remaining; i++) {
    while (!checkedDays.includes(currentDate.getDay())) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const scheduleForDay = schedules.find(
      (s) => s.day === dayNames[currentDate.getDay()]
    );
    if (scheduleForDay) {
      batch.set(db.collection("schedules").doc(), {
        date: format(currentDate, "yyyy-MM-dd"),
        startTime: scheduleForDay.startTime,
        trainerId,
        memberId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  await batch.commit();
  const endDate = format(currentDate, "yyyy-MM-dd");
  await db.collection("memberships").doc(id).update({ endDate });

  logger.info(`일정 생성: membership=${id}, ${remaining}개`);
  return { endDate };
});

/**
 * 회원권 일시중지 (Callable Function)
 * - Transaction으로 상태 변경 + 일정 삭제
 */
exports.pauseMembership = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "인증이 필요합니다.");
  }

  const { membershipId, memberId } = request.data;
  if (!membershipId || !memberId) {
    throw new HttpsError("invalid-argument", "필수 파라미터가 누락되었습니다.");
  }

  const db = admin.firestore();
  const membershipRef = db.collection("memberships").doc(membershipId);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(membershipRef);
    if (!doc.exists) {
      throw new HttpsError("not-found", "회원권이 존재하지 않습니다.");
    }
    transaction.update(membershipRef, { status: "paused" });
  });

  // 일정 삭제
  const schedulesSnap = await db
    .collection("schedules")
    .where("memberId", "==", memberId)
    .get();

  if (!schedulesSnap.empty) {
    const batch = db.batch();
    schedulesSnap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }

  logger.info(`회원권 일시중지: id=${membershipId}, 일정 ${schedulesSnap.size}개 삭제`);
  return { status: "paused", deletedSchedules: schedulesSnap.size };
});

/**
 * 회원권 요일/시간 변경 (Callable Function)
 */
exports.changeMembershipSchedule = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "인증이 필요합니다.");
  }

  const { membershipId, memberId, newSchedules } = request.data;
  if (!membershipId || !memberId || !newSchedules) {
    throw new HttpsError("invalid-argument", "필수 파라미터가 누락되었습니다.");
  }

  const db = admin.firestore();
  const membershipRef = db.collection("memberships").doc(membershipId);

  await membershipRef.update({ schedules: newSchedules });

  // 기존 일정 삭제
  const existingSchedules = await db
    .collection("schedules")
    .where("memberId", "==", memberId)
    .get();

  if (!existingSchedules.empty) {
    const deleteBatch = db.batch();
    existingSchedules.docs.forEach((doc) => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
  }

  // 새 일정 생성
  const membershipDoc = await membershipRef.get();
  const membership = membershipDoc.data();
  const { trainerId, remaining } = membership;
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const checkedDays = newSchedules.map((s) => dayNames.indexOf(s.day));
  let currentDate = new Date();
  const createBatch = db.batch();

  for (let i = 0; i < remaining; i++) {
    while (!checkedDays.includes(currentDate.getDay())) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const scheduleForDay = newSchedules.find(
      (s) => s.day === dayNames[currentDate.getDay()]
    );
    if (scheduleForDay) {
      createBatch.set(db.collection("schedules").doc(), {
        date: format(currentDate, "yyyy-MM-dd"),
        startTime: scheduleForDay.startTime,
        trainerId,
        memberId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  await createBatch.commit();
  const newEndDate = format(currentDate, "yyyy-MM-dd");
  await membershipRef.update({ endDate: newEndDate });

  logger.info(`회원권 일정 변경: id=${membershipId}`);
  return { endDate: newEndDate };
});

/**
 * 일정 삭제 (Callable Function)
 * - 완료 시 잔여횟수 차감 포함
 */
exports.removeSchedule = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "인증이 필요합니다.");
  }

  const { scheduleId, isCompleted } = request.data;
  if (!scheduleId) {
    throw new HttpsError("invalid-argument", "scheduleId가 필요합니다.");
  }

  const db = admin.firestore();
  const scheduleRef = db.collection("schedules").doc(scheduleId);
  const scheduleDoc = await scheduleRef.get();

  if (!scheduleDoc.exists) {
    throw new HttpsError("not-found", "일정이 존재하지 않습니다.");
  }

  if (isCompleted) {
    const { trainerId, memberId } = scheduleDoc.data();
    const membershipSnap = await db
      .collection("memberships")
      .where("trainerId", "==", trainerId)
      .where("memberId", "==", memberId)
      .limit(1)
      .get();

    if (!membershipSnap.empty) {
      const membershipRef = membershipSnap.docs[0].ref;
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(membershipRef);
        const remaining = doc.data().remaining - 1;
        const updateData = { remaining };
        if (remaining === 0) updateData.status = "expired";
        transaction.update(membershipRef, updateData);
      });
    }
  }

  await scheduleRef.delete();
  logger.info(`일정 삭제: id=${scheduleId}, completed=${isCompleted}`);
  return { success: true };
});

/**
 * 일정 업데이트 (Callable Function)
 */
exports.updateSchedule = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "인증이 필요합니다.");
  }

  const { scheduleId, updateField } = request.data;
  await admin.firestore().collection("schedules").doc(scheduleId).update(updateField);
  return { success: true };
});

/**
 * 회원권 삭제 (Callable Function)
 */
exports.removeMembership = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "인증이 필요합니다.");
  }

  const { trainerId, memberId } = request.data;
  const db = admin.firestore();
  const snapshot = await db
    .collection("memberships")
    .where("trainerId", "==", trainerId)
    .where("memberId", "==", memberId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    throw new HttpsError("not-found", "회원권이 존재하지 않습니다.");
  }

  await snapshot.docs[0].ref.delete();
  logger.info(`회원권 삭제: trainer=${trainerId}, member=${memberId}`);
  return { success: true };
});
