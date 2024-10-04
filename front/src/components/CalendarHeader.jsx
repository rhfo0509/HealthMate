import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";

function CalendarHeader({ markedDates, selectedDate, onSelectDate }) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 날짜 선택 모달 열기
  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(selectedDate),
      onChange: (event, date) => {
        if (date) {
          onSelectDate(date); // 날짜 선택 시 달력 업데이트
        }
      },
      mode: "date",
      is24Hour: true,
    });
  };

  // 오늘로 돌아가기 기능
  const goToToday = () => {
    onSelectDate(new Date()); // 오늘 날짜로 설정
  };

  return (
    <View>
      {/* CalendarStrip 위에 버튼을 오른쪽에 배치 */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <Pressable
          onPress={openDatePicker}
          style={{
            padding: 5,
            backgroundColor: "#ccc",
            borderRadius: 5,
            marginRight: 5,
          }}
        >
          <Text style={{ color: "#333", fontSize: 12 }}>날짜 선택</Text>
        </Pressable>

        <Pressable
          onPress={goToToday}
          style={{
            padding: 5,
            backgroundColor: "#ccc",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "#333", fontSize: 12 }}>오늘</Text>
        </Pressable>
      </View>

      {/* CalendarStrip 컴포넌트 */}
      <CalendarStrip
        scrollable
        style={{ height: 80 }}
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
    </View>
  );
}

export default CalendarHeader;
