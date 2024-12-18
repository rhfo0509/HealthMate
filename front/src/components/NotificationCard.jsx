import React from "react";
import { View, StyleSheet, Text, Pressable, Alert } from "react-native";

import { removeSchedule, updateSchedule } from "../lib/schedules";
import { createNotification, updateNotification } from "../lib/notifications";

function NotificationCard({
  createdAt,
  message,
  id,
  senderId,
  receiverId,
  data,
  clicked,
}) {
  // 수락/거절 후 알림 및 스케줄 업데이트 함수
  const handleNotification = (isAccept) => {
    if (isAccept) {
      data.updatedField
        ? updateSchedule(data.scheduleId, data.updatedField)
        : removeSchedule(data.scheduleId, false);

      // 성공적으로 처리된 후 알림 생성
      createNotification({
        senderId: receiverId,
        receiverId: senderId,
        message: data.updatedField
          ? `일정이 성공적으로 변경되었습니다. (${data.updatedField.date} ${data.updatedField.startTime})`
          : "일정이 성공적으로 취소되었습니다.",
        data: null,
      });
    } else {
      // 거절 시 알림 생성
      createNotification({
        senderId: receiverId,
        receiverId: senderId,
        message: data.updatedField
          ? "일정 변경 신청이 반려되었습니다."
          : "일정 삭제 신청이 반려되었습니다.",
        data: null,
      });
    }

    // 알림 상태 업데이트
    updateNotification(id);
  };

  // 수락 버튼 클릭 시 처리
  const onPressAccept = () => {
    Alert.alert(
      null,
      "수락하시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "네",
          onPress: () => handleNotification(true),
        },
      ],
      { cancelable: true }
    );
  };

  // 거절 버튼 클릭 시 처리
  const onPressRefuse = () => {
    Alert.alert(
      null,
      "거절하시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "네",
          onPress: () => handleNotification(false),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{message}</Text>

        {data?.updatedField && (
          <Text style={styles.infoText}>
            변경시간:{" "}
            {`${data.updatedField.date} ${data.updatedField.startTime}`}
          </Text>
        )}

        {data?.reason && (
          <Text style={styles.reasonText}>사유: {data.reason}</Text>
        )}

        <Text style={styles.dateText}>
          {createdAt.toDate().toLocaleString()}
        </Text>
      </View>
      {data && !clicked && (
        <View style={styles.buttons}>
          <Pressable
            style={[styles.button, styles.acceptButton]}
            android_ripple={{ color: "#ededed" }}
            onPress={onPressAccept}
          >
            <Text style={styles.acceptText}>수락</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.refuseButton]}
            android_ripple={{ color: "#ededed" }}
            onPress={onPressRefuse}
          >
            <Text style={styles.refuseText}>거절</Text>
          </Pressable>
        </View>
      )}
      {clicked && (
        <Text style={styles.completedText}>처리가 완료되었습니다.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 1,
  },
  acceptButton: {
    backgroundColor: "#1f6feb",
    borderColor: "#1f6feb",
  },
  acceptText: {
    color: "#fff",
    fontSize: 16,
  },
  refuseButton: {
    backgroundColor: "#fff",
    borderColor: "#1f6feb",
  },
  refuseText: {
    color: "#1f6feb",
    fontSize: 16,
  },
  completedText: {
    color: "#E57373",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
});

export default NotificationCard;
