import { format } from "date-fns";
import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";

function NotificationCard({ createdAt, message, id, userId, data }) {
  return (
    <View style={styles.block}>
      <Text>{createdAt.toDate().toLocaleString()}</Text>
      <Text>{message}</Text>
      <Text>{data.reason}</Text>
      {data.updatedField && (
        <Text>
          {data.updatedField.date} {data.updatedField.startTime} ~{" "}
          {data.updatedField.endTime}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
  },
  paddingBlock: {
    paddingHorizontal: 16,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  displayName: {
    lineHeight: 24,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
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
});

export default NotificationCard;
