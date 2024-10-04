const { onSchedule } = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const { format, isBefore } = require("date-fns");
const admin = require("firebase-admin");
admin.initializeApp();

exports.cleanup = onSchedule("every 5 minutes", async (event) => {
  const schedulesRef = admin.firestore().collection("schedules");
  const membershipsRef = admin.firestore().collection("memberships");

  try {
    const schedules = await schedulesRef.get();
    const batch = admin.firestore().batch();
    const today = format(new Date(), "yyyy-MM-dd");

    schedules.forEach(({ ref, data }) => {
      const scheduleData = data();
      if (!scheduleData) {
        logger.error(`No data found for schedule ${ref.id}`);
        return;
      }

      logger.info(
        `Processing schedule ${ref.id} for member ${scheduleData.memberId}`
      );
      if (isBefore(new Date(scheduleData.date), new Date(today))) {
        batch.delete(ref);
        batch.update(membershipsRef.doc(scheduleData.memberId), {
          remaining: admin.firestore.FieldValue.increment(-1),
        });
        logger.info(
          `Deleted schedule ${ref.id} and updated remaining for member ${scheduleData.memberId}`
        );
      }
    });

    await batch.commit();
    logger.info("Cleanup and membership update successful");
  } catch (error) {
    logger.error("Error during cleanup or update:", error);
  }
});
