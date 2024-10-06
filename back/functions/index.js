const { onSchedule } = require("firebase-functions/v2/scheduler");
const { format, isBefore } = require("date-fns");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

// Firebase 초기화
admin.initializeApp();

exports.cleanup = onSchedule("every day 15:00", async (event) => {
  const schedulesRef = admin.firestore().collection("schedules");

  try {
    // 모든 스케줄 문서를 가져옴
    const schedulesSnapshot = await schedulesRef.get();
    const batch = admin.firestore().batch();
    const today = format(new Date(), "yyyy-MM-dd");

    if (schedulesSnapshot.empty) {
      logger.info("No schedules to process.");
      return;
    }

    for (const scheduleDoc of schedulesSnapshot.docs) {
      const scheduleData = scheduleDoc.data();

      const { date, memberId, trainerId } = scheduleData;

      logger.info(
        `Processing schedule ${scheduleDoc.id} for member ${memberId} and trainer ${trainerId}`
      );

      // 스케줄 날짜가 오늘 이전일 경우만 처리
      if (isBefore(new Date(date), new Date(today))) {
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
        batch.delete(scheduleDoc.ref);
        batch.update(membershipDoc, {
          remaining: admin.firestore.FieldValue.increment(-1),
        });

        logger.info(
          `Deleted schedule ${scheduleDoc.id} and updated remaining for member ${memberId}`
        );
      }
    }

    // 모든 작업을 완료한 후 배치 커밋
    await batch.commit();
    logger.info("Cleanup and membership update successful");
  } catch (error) {
    logger.error("Error during cleanup or update:", error);
  }
});
