import React, { useState } from "react";
import { View, Pressable, StyleSheet, Modal, Text } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { MaterialIcons } from "@expo/vector-icons";
import { format, parse } from "date-fns";

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
  selectedDate,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate);
  };

  const onChangeStartTime = (event, selectedTime) => {
    setShowStartTimePicker(false);
    event.type === "set" ? setStartTime(selectedTime) : setStartTime(startTime);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onPressClose}
    >
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
            <View style={styles.pickerGroup}>
              <Pressable
                style={[styles.picker, { paddingHorizontal: 17 }]}
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
            <View style={styles.pickerGroup}>
              <Pressable
                style={styles.picker}
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
          </View>
          <View style={styles.buttonGroup}>
            <Pressable onPress={onPressSave} style={{ padding: 10 }}>
              <Text style={[styles.text, { color: "#64B5F6" }]}>저장</Text>
            </Pressable>
            <Pressable onPress={onPressClose} style={{ padding: 10 }}>
              <Text style={[styles.text, { color: "#E57373" }]}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonGroup: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9ecef",
    padding: 5,
    borderRadius: 5,
    marginRight: 20,
  },
  pickerGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: -60,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
});

export default ScheduleModal;
