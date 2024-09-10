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
  const { id, date, startTime, endTime, memberId } = schedule;
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());

  // 오늘 날짜인지 확인
  const today = isToday(parsedDate);

  // 오늘 날짜면 남은 시간 표시, 진행 중이면 진행 중이라고 표시
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
      addSuffix: true,
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
    <View style={styles.block}>
      <View style={styles.leftContainer}>
        <Avatar
          source={member?.photoURL && { uri: member?.photoURL }}
          size={48}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.memberName}>{member?.displayName}</Text>
        <View style={styles.scheduleContainer}>
          <Pressable
            onPress={() => handlePress("date")}
            style={styles.dateContainer}
          >
            <Text style={styles.dateText}>{date}</Text>
          </Pressable>
          <Pressable
            onPress={() => handlePress("startTime")}
            style={styles.timeContainer}
          >
            <Text style={styles.timeText}>{startTime}</Text>
          </Pressable>
          <Text style={styles.separator}>~</Text>
          <Pressable
            onPress={() => handlePress("endTime")}
            style={styles.timeContainer}
          >
            <Text style={styles.timeText}>{endTime}</Text>
          </Pressable>
        </View>
        {today && (
          <Text style={styles.statusText}>
            ··· {formatDate(startTime, endTime)}
          </Text>
        )}
      </View>
      {renderPicker()}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  leftContainer: {
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  scheduleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dateContainer: {
    backgroundColor: "#f0f4f8",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#555",
  },
  timeContainer: {
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  timeText: {
    fontSize: 14,
    color: "#00796b",
  },
  separator: {
    fontSize: 14,
    color: "#00796b",
    paddingHorizontal: 8,
  },
  statusText: {
    marginTop: 4,
    fontSize: 12,
    color: "#00796b",
  },
});

export default ScheduleListItem;
