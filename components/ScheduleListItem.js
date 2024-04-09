import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { format, parse } from "date-fns";
import { ko } from "date-fns/locale";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { updateSchedule } from "../lib/schedules";

function ScheduleListItem({ schedule }) {
  const [showPicker, setShowPicker] = useState(null);
  const { id, date, startTime, endTime, memberId, trainerId } = schedule;

  const handlePress = (pickerType) => {
    setShowPicker(pickerType);
  };

  const handleChange = async (event, selectedValue) => {
    const updateFields = {};

    if (event.type === "dismissed") {
      // 사용자가 선택을 취소한 경우
      setShowPicker(null);
    } else {
      // 사용자가 값을 선택한 경우
      console.log(format(selectedValue, "yyyy-MM-dd"));
      switch (showPicker) {
        case "date":
          updateFields.date = format(selectedValue, "yyyy-MM-dd");
          break;
        case "startTime":
          updateFields.startTime = format(selectedValue, "HH:mm");
          break;
        case "endTime":
          updateFields.endTime = format(selectedValue, "HH:mm");
          break;
        default:
          break;
      }
      console.log(id, updateFields);
      updateSchedule(id, updateFields);
      setShowPicker(null);
    }
  };

  const renderPicker = () => {
    if (showPicker === "date") {
      return (
        <RNDateTimePicker
          value={parse(date, "yyyy-MM-dd", new Date())}
          display="spinner"
          onChange={handleChange}
        />
      );
    } else if (showPicker === "startTime" || showPicker === "endTime") {
      return (
        <RNDateTimePicker
          value={parse(
            showPicker === "startTime" ? startTime : endTime,
            "HH:mm",
            new Date()
          )}
          mode="time"
          is24Hour={true}
          minuteInterval={10}
          display="spinner"
          onChange={handleChange}
        />
      );
    }
    return null;
  };

  return (
    <Pressable style={styles.block} android_ripple={{ color: "#ededed" }}>
      <View style={styles.date}>
        <Pressable
          android_ripple={{ color: "#f1f3f5" }}
          onPress={() => handlePress("date")}
        >
          <Text>{date}</Text>
        </Pressable>
        <Pressable
          android_ripple={{ color: "#f1f3f5" }}
          onPress={() => handlePress("startTime")}
        >
          <Text>{startTime}</Text>
        </Pressable>
        <Pressable
          android_ripple={{ color: "#f1f3f5" }}
          onPress={() => handlePress("endTime")}
        >
          <Text>{endTime}</Text>
        </Pressable>
      </View>
      {renderPicker()}
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
    flexDirection: "row",
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
