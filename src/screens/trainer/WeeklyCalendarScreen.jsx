import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../../contexts/UserContext";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getTrainerSchedules } from "../../lib/schedules";
import { getMembersByTrainer } from "../../lib/users";
import { startOfWeek, endOfWeek, format, addDays, addMinutes } from "date-fns";
import { ko } from "date-fns/locale"; // 한글 요일을 위한 locale import

const HOURS_IN_DAY = Array.from({ length: 14 }, (_, i) => i + 9); // 9시부터 22시까지

function WeeklyCalendarScreen() {
  const navigation = useNavigation();
  const { user } = useUserContext();
  const firestore = getFirestore();
  const schedulesCollection = collection(firestore, "schedules");
  const [memberList, setMemberList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);

  // 이번 주의 시작 날짜와 끝 날짜 계산 (월요일 ~ 일요일)
  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  // 최초로 WeeklyCalendarScreen 접근 시
  useEffect(() => {
    getMembersByTrainer(user.id).then(setMemberList);
    getTrainerSchedules(user.id).then(setScheduleList);
  }, []);

  // schedules 컬렉션에 변화 발생시
  useEffect(() => {
    const q = query(schedulesCollection, where("trainerId", "==", user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const schedules = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setScheduleList(schedules);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const onPress = () => {
    navigation.navigate("Calendar");
  };

  useEffect(() => {
    navigation.setOptions({
      title: "주간 일정",
      headerRight: () => (
        <Pressable onPress={onPress}>
          <Text style={{ color: "royalblue" }}>월간 일정 보기</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const combineDateAndTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const [hours, minutes] = timeStr.split(":");
    date.setHours(+hours);
    date.setMinutes(+minutes);
    return date;
  };

  const members = memberList?.map((member) => ({
    id: member.id,
    name: member.displayName,
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
  }));

  // 이번 주 일정 필터링
  const events = scheduleList
    ?.filter((schedule) => {
      const eventDate = new Date(schedule.date);
      return eventDate >= thisWeekStart && eventDate <= thisWeekEnd;
    })
    .map((schedule) => {
      const selectedMember = members.find(
        (member) => member.id === schedule.memberId
      );
      const startDate = combineDateAndTime(schedule.date, schedule.startTime);
      const endDate = addMinutes(startDate, 60); // startTime + 60분으로 설정
      return {
        id: schedule.id,
        startDate,
        endDate,
        color: selectedMember?.color,
        description: selectedMember?.name,
      };
    });

  // 이번 주 날짜 배열 생성 (월요일 ~ 일요일)
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    daysOfWeek.push(addDays(thisWeekStart, i));
  }

  // 특정 시간에 맞는 이벤트 찾기
  const getEventsForTime = (day, hour) => {
    return events.filter(
      (event) =>
        event.startDate.toDateString() === day.toDateString() &&
        event.startDate.getHours() === hour
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더와 시간대 열 */}
      <View style={styles.row}>
        <View style={styles.timeColumn}>
          <View style={styles.headerTextPlaceholder} />
          {HOURS_IN_DAY.map((hour) => (
            <View key={hour} style={styles.timeSlot}>
              <Text style={styles.timeText}>{`${hour}:00`}</Text>
            </View>
          ))}
        </View>

        {/* 요일별 일정 표시 */}
        {daysOfWeek.map((day) => (
          <View key={day} style={styles.dayColumn}>
            <View style={styles.headerTextContainer}>
              {/* 날짜와 요일을 두 줄로 표시 */}
              <Text style={styles.dateText}>{format(day, "M/d")}</Text>
              <Text style={styles.dayText}>
                {format(day, "(EEE)", { locale: ko })}
              </Text>
            </View>
            {HOURS_IN_DAY.map((hour) => {
              const dayEvents = getEventsForTime(day, hour);
              return (
                <View key={hour} style={styles.timeSlot}>
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <View
                        key={event.id}
                        style={[styles.event, { backgroundColor: event.color }]}
                      >
                        <Text style={styles.eventText}>
                          {format(event.startDate, "HH:mm")} -{" "}
                          {format(event.endDate, "HH:mm")}
                        </Text>
                        <Text style={styles.eventText}>
                          {event.description}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.noEvent} />
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  row: {
    flexDirection: "row",
  },
  timeColumn: {
    width: 60,
    paddingVertical: 10,
  },
  timeSlot: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  timeText: {
    fontSize: 14,
    color: "#666",
  },
  headerTextPlaceholder: {
    height: 60, // 헤더와 시간대의 간격 확보
  },
  dayColumn: {
    flex: 1,
    paddingVertical: 10,
  },
  headerTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // 연한 배경색
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // 헤더 하단 경계선
    height: 60, // 시간 슬롯과 동일한 높이 유지
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dayText: {
    fontSize: 12,
    color: "#666",
  },
  event: {
    padding: 6,
    margin: 2,
    justifyContent: "center",
  },
  eventText: {
    color: "white",
    fontSize: 10,
    textAlign: "center",
  },
  noEvent: {
    height: 60,
    width: "100%",
  },
});

export default WeeklyCalendarScreen;
