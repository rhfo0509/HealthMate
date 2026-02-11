import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { ko } from "date-fns/locale";
import {
  format,
  parse,
  formatDistance,
  isToday,
  set,
  addMinutes,
} from "date-fns";
import { colors } from "../styles/theme";

import { getUser } from "../lib/users";
import { updateSchedule } from "../lib/schedules";
import Avatar from "./Avatar";

function ScheduleListItem({ schedule }) {
  const [show, setShow] = useState(null);
  const [member, setMember] = useState(null);
  const { id, date, startTime, memberId } = schedule;
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());

  // 회원 정보 가져오기
  useEffect(() => {
    getUser(memberId).then(setMember);
  }, [memberId]);

  // 시작 시간의 60분 이후를 종료 시간으로 설정
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const endTime = format(
    addMinutes(
      set(parsedDate, { hours: startHours, minutes: startMinutes }),
      60
    ),
    "HH:mm"
  );

  // 오늘이 일정 날짜인지 확인
  const today = isToday(parsedDate);

  // 시간을 format하여 남은 시간을 표시하거나 '진행 중' 표시
  function formatTime(startTime, endTime) {
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

    // 현재 시간이 시작 시간과 종료 시간 사이에 있으면 '진행 중' 표시
    if (now >= startDate && now <= endDate) {
      return "진행 중";
    }

    // 그렇지 않으면 남은 시간 표시
    return formatDistance(startDate.getTime(), now, {
      addSuffix: true,
      locale: ko,
    });
  }

  // 날짜 또는 시간을 변경할 때 picker를 보여주는 함수
  const handlePress = (pickerType) => {
    setShow(pickerType);
  };

  // picker에서 값을 선택했을 때 처리하는 함수
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
        default:
          break;
      }
      // 일정 업데이트
      updateSchedule(id, updateFields);
      setShow(null);
    }
  };

  // 날짜인지 시간인지에 따라 다른 picker 보여줌
  const renderPicker = () => {
    if (show === "date") {
      return (
        <RNDateTimePicker
          value={parsedDate}
          display="spinner"
          onChange={handleChange}
        />
      );
    } else if (show === "startTime") {
      return (
        <RNDateTimePicker
          value={parse(startTime, "HH:mm", new Date())}
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
    <View style={styles.container}>
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
          <Text style={styles.timeText}>{endTime}</Text>
        </View>
        {today && (
          <Text style={styles.statusText}>
            ··· {formatTime(startTime, endTime)}
          </Text>
        )}
      </View>
      {renderPicker()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: colors.gray[900],
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
    lineHeight: 24,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.primary,
  },
  scheduleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dateContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.gray[700],
  },
  timeContainer: {
    backgroundColor: colors.primary[50],
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.primary[600],
  },
  separator: {
    fontSize: 14,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.primary[600],
    paddingHorizontal: 8,
  },
  statusText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.primary[600],
  },
});

export default ScheduleListItem;