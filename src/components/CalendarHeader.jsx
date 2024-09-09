import React from "react";
import CalendarStrip from "react-native-calendar-strip";

function CalendarHeader({ markedDates, selectedDate, onSelectDate }) {
  return (
    <CalendarStrip
      scrollable
      style={{ height: 120, paddingTop: 20, paddingBottom: 10 }}
      calendarColor={"white"}
      calendarHeaderStyle={{ color: "#333" }}
      dateNumberStyle={{ color: "#333" }}
      dateNameStyle={{ display: "none" }}
      iconContainer={{ flex: 0.1 }}
      markedDates={markedDates}
      onDateSelected={(date) => onSelectDate(new Date(date))}
      selectedDate={new Date(selectedDate)}
      highlightDateNameStyle={{ display: "none" }}
      highlightDateNumberStyle={{ color: "royalblue" }}
      calendarHeaderFormat={"YYYY년 M월"}
    />
  );
}

export default CalendarHeader;
