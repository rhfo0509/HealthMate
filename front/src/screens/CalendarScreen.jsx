import React, { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { colors } from "../styles/theme";

import { useUserContext } from "../contexts/UserContext";
import IconRightButton from "../components/IconRightButton";
import CalendarView from "../components/CalendarView";
import ScheduleList from "../components/ScheduleList";

function CalendarScreen() {
  const navigation = useNavigation();
  const { user } = useUserContext();
  const [scheduleList, setScheduleList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const firestore = getFirestore();
  const schedulesCollection = collection(firestore, "schedules");

  // 최초 화면 접근 시 로그인한 트레이너의 일정을 받아오고
  // 이후 schedules 컬렉션에 변화 발생시 실행
  useEffect(() => {
    const q = query(
      schedulesCollection,
      where("trainerId", "==", user.id),
      orderBy("date"),
      orderBy("startTime")
    );
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

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerRight: () => (
        <Pressable
          onPress={() => {
            navigation.navigate("WeeklyCalendar");
          }}
        >
          <Text style={{ color: colors.primary[500], fontFamily: 'Cafe24SsurroundAir', fontSize: 14 }}>주간 일정 보기</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  // 캘린더에서 일정이 있는 날짜에 대해 marked 처리
  const markedDates = scheduleList.reduce((acc, cur) => {
    acc[cur.date] = { marked: true };
    return acc;
  }, {});

  // 일정을 날짜별로 분류
  const filteredScheduleList = scheduleList.filter(
    (schedule) => schedule.date === selectedDate
  );

  return (
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
  );
}

export default CalendarScreen;