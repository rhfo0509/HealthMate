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
  const onPressAccept = () => {
    Alert.alert(
      null,
      "수락하시겠습니까?",
      [
        {
          text: "아니오",
          style: "cancel",
        },
        {
          text: "네",
          onPress: () => {
            data.updatedField
              ? updateSchedule(data.scheduleId, data.updatedField)
              : removeSchedule(data.scheduleId, false);
            updateNotification(id);
            data.updatedField
              ? createNotification({
                  senderId: receiverId,
                  receiverId: senderId,
                  message: `일정이 성공적으로 변경되었습니다.(${data.updatedField.date} ${data.updatedField.startTime} ~ ${data.updatedField.endTime})`,
                  data: null,
                })
              : createNotification({
                  senderId: receiverId,
                  receiverId: senderId,
                  message: `일정이 성공적으로 취소되었습니다.`,
                  data: null,
                });
          },
        },
      ],
      { cancelable: true }
    );
  };
  const onPressRefuse = () => {
    Alert.alert(
      null,
      "거절하시겠습니까?",
      [
        {
          text: "아니오",
          style: "cancel",
        },
        {
          text: "네",
          onPress: () => {
            updateNotification(id);
            data.updatedField
              ? createNotification({
                  senderId: receiverId,
                  receiverId: senderId,
                  message: `일정 변경 신청이 반려되었습니다.`,
                  data: null,
                })
              : createNotification({
                  senderId: receiverId,
                  receiverId: senderId,
                  message: `일정 삭제 신청이 반려되었습니다.`,
                  data: null,
                });
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <View style={styles.block}>
      <Text style={[styles.content, { fontWeight: "600" }]}>{message}</Text>
      {data && <Text style={styles.content}>사유: {data.reason}</Text>}
      <Text style={styles.date}>{createdAt.toDate().toLocaleString()}</Text>
      {data ? (
        clicked ? (
          <Text style={{ color: "#E57373", fontWeight: "600" }}>
            처리가 완료되었습니다.
          </Text>
        ) : (
          <View style={styles.buttons}>
            <Pressable
              style={[styles.button, { backgroundColor: "#64B5F6" }]}
              android_ripple={{ color: "#ededed" }}
              onPress={onPressAccept}
            >
              <Text style={{ color: "white" }}>수락</Text>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: "#E57373" }]}
              android_ripple={{ color: "#ededed" }}
              onPress={onPressRefuse}
            >
              <Text style={{ color: "white" }}>거절</Text>
            </Pressable>
          </View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
    marginVertical: 8,
    borderRadius: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  date: {
    color: "#757575",
    fontSize: 12,
    lineHeight: 18,
  },
  buttons: {
    flexDirection: "row",
    marginTop: 8,
  },
  button: {
    width: "50%",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 4,
  },
});

export default NotificationCard;
