import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  const { user } = useUserContext();
  const firestore = getFirestore();
  const schedulesCollection = collection(firestore, "schedules");
  const [scheduleList, setScheduleList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  useEffect(() => {
    getTrainerSchedules(user.id).then(setScheduleList);
  }, [user.id]);

  useFocusEffect(
    useCallback(() => {
      const q = query(schedulesCollection, where("trainerId", "==", user.id));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        unsubscribe();
        const schedules = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setScheduleList(schedules);
      });
      // return () => {
      //   unsubscribe();
      // };
    }, [user.id])
  );

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
