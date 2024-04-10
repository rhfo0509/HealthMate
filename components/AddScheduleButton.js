import React, { useState, useEffect } from "react";
import { View, Pressable, StyleSheet, Modal, Button, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserContext } from "../contexts/UserContext";
import { getMembersByTrainer } from "../lib/users";
import { createSchedule } from "../lib/schedules";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { format, parse } from "date-fns";

function AddScheduleButton({ selectedDate }) {
  const { user: trainer } = useUserContext();

  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    getMembersByTrainer(trainer.id).then(setMemberList);
  }, [trainer.id]);

  const handleSave = async () => {
    await createSchedule({
      memberId: selectedMemberId,
      trainerId: trainer.id,
      date: date ? format(date, "yyyy-MM-dd") : selectedDate,
      startTime: format(startTime, "HH:mm"),
      endTime: format(endTime, "HH:mm"),
    });

    setShowModal(false);
    setSelectedMemberId("");
    setDate(null);
    setStartTime(null);
    setEndTime(null);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedMemberId("");
    setDate(null);
    setStartTime(null);
    setEndTime(null);
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate || date);
  };

  const onChangeStartTime = (event, selectedTime) => {
    setShowStartTimePicker(false);
    setStartTime(selectedTime || startTime);
  };

  const onChangeEndTime = (event, selectedTime) => {
    setShowEndTimePicker(false);
    setEndTime(selectedTime || endTime);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.circle} onPress={() => setShowModal(true)}>
        <MaterialIcons name="event" size={24} color="white" />
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <RNPickerSelect
              value={selectedMemberId}
              onValueChange={(value) => setSelectedMemberId(value)}
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
                  onPress={() => setShowDatePicker(true)}
                >
                  <MaterialIcons
                    name="calendar-month"
                    size={24}
                    color="black"
                  />
                  <Text> 날짜</Text>
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
                  <Text> 시작시간</Text>
                </Pressable>
                {showStartTimePicker && (
                  <RNDateTimePicker
                    value={startTime || new Date()}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={onChangeStartTime}
                    minuteInterval={10}
                  />
                )}
                {startTime && <Text>{format(startTime, `HH시 mm분`)}</Text>}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 30,
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
                  <Text> 종료시간</Text>
                </Pressable>
                {showEndTimePicker && (
                  <RNDateTimePicker
                    value={endTime || new Date()}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={onChangeEndTime}
                    minuteInterval={10}
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
              <Pressable onPress={handleSave} style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>저장</Text>
              </Pressable>
              <Pressable onPress={handleClose} style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>닫기</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 5,
    borderRadius: 27,
    height: 54,
    width: 54,
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  circle: {
    backgroundColor: "#6200ee",
    borderRadius: 27,
    height: 54,
    width: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 배경
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
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

export default AddScheduleButton;
