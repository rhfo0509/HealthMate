import React, { useEffect, useState } from "react";
import CalendarView from "../components/CalendarView";
import AddScheduleButton from "../components/AddScheduleButton";
import { getMemberSchedules, getTrainerSchedules } from "../lib/schedules";
import { useUserContext } from "../contexts/UserContext";
import { format } from "date-fns";
import ScheduleList from "../components/ScheduleList";

function CalendarScreen() {
  const { user } = useUserContext();
  const [scheduleList, setScheduleList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  useEffect(() => {
    getTrainerSchedules(user.id).then(setScheduleList);
  }, [user.id]);

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
      <AddScheduleButton />
    </>
  );
}

export default CalendarScreen;
