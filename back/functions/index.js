const { onSchedule } = require("firebase-functions/v2/scheduler");
const { format, subDays } = require("date-fns");
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
          `Deleted notification ${notiDoc.id} created on ${
            notiDoc.data().createdAt
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
