import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, StyleSheet } from "react-native";
import WeekView from "react-native-week-view";
import { useUserContext } from "../contexts/UserContext";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getTrainerSchedules } from "../lib/schedules";
import { getMembersByTrainer } from "../lib/users";

function WeeklyCalendarScreen() {
  const navigation = useNavigation();
  const { user } = useUserContext();
  const firestore = getFirestore();
  const schedulesCollection = collection(firestore, "schedules");
  const [memberList, setMemberList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);

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
    // 멤버별로 랜덤 색상 지정
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
  }));

  const events = scheduleList?.map((schedule) => {
    const selectedMember = members.find(
      (member) => member.id === schedule.memberId
    );

    return {
      id: schedule.id,
      startDate: combineDateAndTime(schedule.date, schedule.startTime),
      endDate: combineDateAndTime(schedule.date, schedule.endTime),
      color: selectedMember?.color,
      description: selectedMember?.name,
    };
  });

  return (
    <WeekView
      events={events}
      selectedDate={new Date()}
      numberOfDays={7}
      pageStartAt={{ weekday: 1 }}
      headerStyle={styles.header}
      headerTextStyle={styles.headerText}
      hourTextStyle={styles.hourText}
      eventTextStyle={styles.eventText}
      formatTimeLabel="HH:mm"
      beginAgendaAt={9 * 60}
      endAgendaAt={22 * 60}
      hoursInDisplay={16}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    backgroundColor: "#4286f4",
    borderColor: "#fff",
  },
  headerText: {
    color: "white",
  },
  hourText: {
    color: "black",
  },
  eventText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
  },
});

export default WeeklyCalendarScreen;
