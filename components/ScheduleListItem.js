import React from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import { formatDistanceToNow, format } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native";

function ScheduleListItem({ schedule }) {
  console.log(schedule);
  const { date, startTime, endTime, memberId, trainerId } = schedule;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.block,
        Platform.OS === "ios" && pressed && { backgroundColor: "#efefef" },
      ]}
      android_ripple={{ color: "#ededed" }}
      // onPress={onPress}
    >
      <Text style={styles.date}>
        {date} {startTime} - {endTime}
      </Text>
      <Text style={styles.title}>{memberId}</Text>
      <Text style={styles.body}>{trainerId}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  date: {
    fontSize: 12,
    color: "#546e7a",
    marginBottom: 8,
  },
  title: {
    color: "#263238",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  body: {
    color: "#37474f",
    fontSize: 16,
    lineHeight: 21,
  },
});

export default ScheduleListItem;
