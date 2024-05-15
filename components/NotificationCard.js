import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";

function NotificationCard({ createdAt, message, id, userId, data }) {
  const onPressAccept = () => {};
  const onPressRefuse = () => {};
  return (
    <View style={styles.block}>
      <Text style={[styles.content, { fontWeight: "600" }]}>{message}</Text>
      <Text style={styles.content}>사유: {data.reason}</Text>
      <Text style={styles.date}>{createdAt.toDate().toLocaleString()}</Text>
      {/* {data.updatedField && (
        <Text>
          {data.updatedField.date} {data.updatedField.startTime} ~{" "}
          {data.updatedField.endTime}
        </Text>
      )} */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
    marginTop: 16,
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
