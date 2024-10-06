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
import { startOfWeek, endOfWeek, format, addDays } from "date-fns";
import { ko } from "date-fns/locale";

const HOURS_IN_DAY = Array.from({ length: 14 }, (_, i) => i + 9); // 9시부터 22시까지

function WeeklyCalendarScreen() {
  const navigation = useNavigation();
  const { user } = useUserContext();
  const firestore = getFirestore();
  const [memberList, setMemberList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);

  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  useEffect(() => {
    const fetchData = async () => {
      setMemberList(await getMembersByTrainer(user.id));
      setScheduleList(await getTrainerSchedules(user.id));
    };
    fetchData();

    const q = query(
      collection(firestore, "schedules"),
      where("trainerId", "==", user.id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setScheduleList(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => unsubscribe();
  }, [firestore, user.id]);

  useEffect(() => {
    navigation.setOptions({
      title: "주간 일정",
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate("Calendar")}>
          <Text style={{ color: "royalblue" }}>월간 일정 보기</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const combineDateAndTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    const [hours, minutes] = timeStr.split(":").map(Number);
    date.setHours(hours, minutes);
    return date;
  };

  const members = memberList?.map((member) => ({
    id: member.id,
    name: member.displayName,
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
  }));

  const events = scheduleList
    ?.filter(
      ({ date }) =>
        new Date(date) >= thisWeekStart && new Date(date) <= thisWeekEnd
    )
    .map(({ id, date, startTime, memberId }) => {
      const startDate = combineDateAndTime(date, startTime);
      const endDate = new Date(startDate.getTime() + 60 * 60000); // 60분 수업
      const member = members.find((m) => m.id === memberId);
      return {
        id,
        startDate,
        endDate,
        color: member?.color,
        description: member?.name,
      };
    });

  const getTopOffset = (startDate) => (startDate.getMinutes() === 30 ? 30 : 0);

  const getEventsForTime = (day, hour) =>
    events.filter(
      ({ startDate }) =>
        startDate.toDateString() === day.toDateString() &&
        startDate.getHours() === hour
    );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <View style={styles.timeColumn}>
          <View style={styles.headerTextPlaceholder} />
          {HOURS_IN_DAY.map((hour) => (
            <View key={hour} style={styles.timeSlot}>
              <Text style={styles.timeText}>{`${hour}:00`}</Text>
            </View>
          ))}
        </View>

        {Array.from({ length: 7 }, (_, i) => addDays(thisWeekStart, i)).map(
          (day) => (
            <View key={day} style={styles.dayColumn}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.dateText}>{format(day, "M/d")}</Text>
                <Text style={styles.dayText}>
                  {format(day, "(EEE)", { locale: ko })}
                </Text>
              </View>
              {HOURS_IN_DAY.map((hour) => (
                <View key={hour} style={styles.timeSlot}>
                  {getEventsForTime(day, hour).map((event) => (
                    <View
                      key={event.id}
                      style={[
                        styles.event,
                        {
                          backgroundColor: event.color,
                          marginTop: getTopOffset(event.startDate),
                        },
                      ]}
                    >
                      <Text style={styles.eventText}>
                        {format(event.startDate, "HH:mm")} -{" "}
                        {format(event.endDate, "HH:mm")}
                      </Text>
                      <Text style={styles.eventText}>{event.description}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  timeText: {
    fontSize: 14,
    color: "#666",
  },
  headerTextPlaceholder: {
    height: 60,
  },
  dayColumn: {
    flex: 1,
    paddingVertical: 10,
  },
  headerTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    height: 60,
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
    height: 60,
  },
  eventText: {
    color: "white",
    fontSize: 10,
    textAlign: "center",
  },
});

export default WeeklyCalendarScreen;
