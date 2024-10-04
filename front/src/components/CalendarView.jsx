import React from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { StyleSheet } from "react-native";

LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
};

LocaleConfig.defaultLocale = "ko";

function CalendarView({ markedDates, selectedDate, onSelectDate }) {
  const markedSelectedDate = {
    ...markedDates,
    [selectedDate]: {
      selected: true,
      marked: markedDates[selectedDate]?.marked,
    },
  };
  return (
    <Calendar
      style={styles.calendar}
      markedDates={markedSelectedDate}
      onDayPress={(day) => onSelectDate(day.dateString)}
      monthFormat={"yyyy년 MM월"}
      hideExtraDays
      theme={{
        selectedDayBackgroundColor: "royalblue",
        arrowColor: "royalblue",
        dotColor: "royalblue",
        todayTextColor: "royalblue",
      }}
    />
  );
}

const styles = StyleSheet.create({
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
});

export default CalendarView;
