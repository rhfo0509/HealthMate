import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { format, parse, formatDistance, isToday, set } from "date-fns";
import { ko } from "date-fns/locale";
import { updateSchedule } from "../lib/schedules";
import { getUser } from "../lib/users";
import Avatar from "./Avatar";

function ScheduleListItem({ schedule }) {
  const [show, setShow] = useState(null);
  const [member, setMember] = useState(null);
  const { id, date, startTime, endTime, memberId, trainerId } = schedule;
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());

  // 오늘 날짜인지 확인
  const today = isToday(parsedDate);

  // 오늘 날짜면 남은 시간 표시, 진행중이면 진행중이라고 표시
  function formatDate(startTime, endTime) {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const now = Date.now();

    const startDate = set(parsedDate, {
      hours: startHours,
      minutes: startMinutes,
    });

    const endDate = set(parsedDate, {
      hours: endHours,
      minutes: endMinutes,
    });

    if (now >= startDate && now <= endDate) {
      return "진행 중";
    }

    return formatDistance(startDate.getTime(), now, {
      addSuffix: "true",
      locale: ko,
    });
  }

  useEffect(() => {
    getUser(memberId).then(setMember);
  }, []);

  const handlePress = (pickerType) => {
    setShow(pickerType);
  };

  const handleChange = async (event, selectedValue) => {
    const updateFields = {};

    if (event.type === "dismissed") {
      setShow(null);
    } else {
      switch (show) {
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
      updateSchedule(id, updateFields);
      setShow(null);
    }
  };

  const renderPicker = () => {
    if (show === "date") {
      return (
        <RNDateTimePicker
          value={parsedDate}
          display="spinner"
          onChange={handleChange}
        />
      );
    } else if (show === "startTime" || show === "endTime") {
      return (
        <RNDateTimePicker
          value={parse(
            show === "startTime" ? startTime : endTime,
            "HH:mm",
            new Date()
          )}
          mode="time"
          is24Hour={true}
          minuteInterval={30}
          display="spinner"
          onChange={handleChange}
        />
      );
    }
    return null;
  };

  return (
    <View
      style={[styles.block, { flexDirection: "row", alignItems: "center" }]}
    >
      <Avatar source={member?.photoURL && { uri: member?.photoURL }} />
      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.text, { width: 60 }]}>{member?.displayName}</Text>
        <Pressable onPress={() => handlePress("date")}>
          <Text style={styles.text}>{date}</Text>
        </Pressable>
        <Pressable onPress={() => handlePress("startTime")}>
          <Text style={styles.text}>{startTime}</Text>
        </Pressable>
        <Text style={styles.text}>~</Text>
        <Pressable onPress={() => handlePress("endTime")}>
          <Text style={styles.text}>{endTime}</Text>
        </Pressable>
        {today && (
          <Text style={styles.text}>··· {formatDate(startTime, endTime)}</Text>
        )}
      </View>
      {renderPicker()}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 5,
  },
  text: {
    color: "#37474f",
    fontSize: 14,
    paddingLeft: 4,
  },
});

export default ScheduleListItem;
