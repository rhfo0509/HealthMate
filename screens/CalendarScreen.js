import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Pressable, Text } from "react-native";
import CalendarView from "../components/CalendarView";
import AddScheduleButton from "../components/AddScheduleButton";
import { useUserContext } from "../contexts/UserContext";
import { format } from "date-fns";
import ScheduleList from "../components/ScheduleList";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  // limit,
} from "firebase/firestore";
import { getTrainerSchedules } from "../lib/schedules";

function CalendarScreen() {
  const navigation = useNavigation();
  const { user } = useUserContext();
  const firestore = getFirestore();
  const schedulesCollection = collection(firestore, "schedules");
  const [scheduleList, setScheduleList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  // 최초로 CalendarScreen 접근 시
  useEffect(() => {
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

  // 날짜별 -> 시간별로 일정 정렬
  useEffect(() => {
    scheduleList.sort((a, b) => {
      // 먼저 날짜를 비교하여 오름차순으로 정렬
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      // 날짜가 동일한 경우 시작시간을 비교하여 오름차순으로 정렬
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
    });
  }, [scheduleList]);

  const onPress = () => {
    navigation.navigate("WeeklyCalendar");
  };

  useEffect(() => {
    navigation.setOptions({
      title: "월간 일정",
      headerRight: () => (
        <Pressable onPress={onPress}>
          <Text style={{ color: "royalblue" }}>주간 일정 보기</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  // useFocusEffect(
  //   useCallback(() => {
  //     const q = query(schedulesCollection, where("trainerId", "==", user.id));
  //     const unsubscribe = onSnapshot(q, (snapshot) => {
  //       unsubscribe();
  //       const schedules = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setScheduleList(schedules);
  //     });
  //   }, [user.id])
  // );

  const markedDates = scheduleList.reduce((acc, cur) => {
    acc[cur.date] = { marked: true };
    return acc;
  }, {});

  const filteredScheduleList = scheduleList.filter(
    (schedule) => schedule.date === selectedDate
  );

  return (
    <>
      <ScheduleList
        schedules={filteredScheduleList}
        ListHeaderComponent={
          <CalendarView
            markedDates={markedDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        }
      />
      <AddScheduleButton selectedDate={selectedDate} />
    </>
  );
}

export default CalendarScreen;
