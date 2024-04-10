import React, { useEffect, useState } from "react";
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

function CalendarScreen() {
  const { user } = useUserContext();
  const firestore = getFirestore();
  const schedulesCollection = collection(firestore, "schedules");
  const [scheduleList, setScheduleList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

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
  }, [user.id]);

  const markedDates = scheduleList.reduce((acc, cur) => {
    acc[cur.date] = { marked: true };
    return acc;
  }, {});

  const filteredScheduleList = scheduleList.filter(
    (schedule) => schedule.date === selectedDate
  );

  console.log(selectedDate);

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
