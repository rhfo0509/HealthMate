import React, { useState } from "react";
import { View, Pressable, StyleSheet, Modal, Text } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { MaterialIcons } from "@expo/vector-icons";
import { parse } from "date-fns";

function ScheduleModal({
  visible,
  onPressSave,
  onPressClose,
  memberId,
  setMemberId,
  memberList,
  date,
  setDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  selectedDate,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate);
  };

  const onChangeStartTime = (event, selectedTime) => {
    setShowStartTimePicker(false);
    event.type === "set" ? setStartTime(selectedTime) : setStartTime(startTime);
  };

  const onChangeEndTime = (event, selectedTime) => {
    setShowEndTimePicker(false);
    event.type === "set" ? setEndTime(selectedTime) : setEndTime(endTime);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.container}>
        <View style={styles.content}>
          <RNPickerSelect
            value={memberId}
            onValueChange={(value) => setMemberId(value)}
            items={memberList.map((member) => {
              return { label: member.displayName, value: member.id };
            })}
            placeholder={{
              label: "회원 선택",
              color: "#ced4da",
            }}
          />
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                marginLeft: -60,
              }}
            >
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#e9ecef",
                  padding: 5,
                  borderRadius: 5,
                  marginRight: 50,
                }}
                onPress={() => setShowDatePicker(true)}
              >
                <MaterialIcons name="calendar-month" size={24} color="black" />
                <Text> 날짜 선택</Text>
              </Pressable>
              {showDatePicker && (
                <RNDateTimePicker
                  value={parse(selectedDate, "yyyy-MM-dd", new Date())}
                  display="spinner"
                  onChange={onChangeDate}
                />
              )}
              <Text>{date ? format(date, "yyyy-MM-dd") : selectedDate}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                marginLeft: -60,
              }}
            >
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#e9ecef",
                  padding: 5,
                  borderRadius: 5,
                  marginRight: 30,
                }}
                onPress={() => setShowStartTimePicker(true)}
              >
                <MaterialIcons name="access-time" size={24} color="black" />
                <Text> 시작시간 선택</Text>
              </Pressable>
              {showStartTimePicker && (
                <RNDateTimePicker
                  value={startTime || new Date()}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onChangeStartTime}
                  minuteInterval={30}
                />
              )}
              {startTime && <Text>{format(startTime, `HH시 mm분`)}</Text>}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                marginLeft: -60,
              }}
            >
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#e9ecef",
                  padding: 5,
                  borderRadius: 5,
                  marginRight: 30,
                }}
                onPress={() => setShowEndTimePicker(true)}
              >
                <MaterialIcons name="access-time" size={24} color="black" />
                <Text> 종료시간 선택</Text>
              </Pressable>
              {showEndTimePicker && (
                <RNDateTimePicker
                  value={endTime || new Date()}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onChangeEndTime}
                  minuteInterval={30}
                />
              )}
              {endTime && <Text>{format(endTime, "HH시 mm분")}</Text>}
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              bottom: 10,
              right: 10,
            }}
          >
            <Pressable onPress={onPressSave} style={{ padding: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>저장</Text>
            </Pressable>
            <Pressable onPress={onPressClose} style={{ padding: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 배경
  },
  content: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 50,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default ScheduleModal;
