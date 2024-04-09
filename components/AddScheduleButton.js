import React, { useState, useEffect } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Modal,
  Button,
  TextInput,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";
import {
  getMembersByTrainer,
  addScheduleToMember,
  addScheduleToTrainer,
} from "../lib/users";
import { createSchedule } from "../lib/schedules";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { format } from "date-fns";

// const TABBAR_HEIGHT = 49;

function AddScheduleButton() {
  // const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const { user: trainer } = useUserContext();

  // const [memberName, setMemberName] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    getMembersByTrainer(trainer.id).then(setMemberList);
  }, [trainer.id]);

  const handleSave = async () => {
    const schedule = await createSchedule({
      memberId: selectedMemberId,
      trainerId: trainer.id,
      date: format(date, "yyyy-MM-dd"),
      startTime: format(startTime, "HH:mm"),
      endTime: format(endTime, "HH:mm"),
    });
    console.log("schedule", schedule.id);

    if (schedule) {
      await addScheduleToMember(selectedMemberId, schedule.id);
      await addScheduleToTrainer(trainer.id, schedule.id);
      console.log("스케줄이 회원과 트레이너에게 추가되었습니다.");
    }

    setShowModal(false);
    setSelectedMemberId("");
    setDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
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

  // const onSubmit = () => {
  //   addMemberToTrainer(trainer.id, memberId);
  //   setMemberId("");
  //   setShow(false); // Modal 닫기
  // };
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
              }}
            />
            <Button title="날짜" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
              <RNDateTimePicker
                value={date}
                display="spinner"
                onChange={onChangeDate}
              />
            )}
            <Button
              title="시작 시간"
              onPress={() => setShowStartTimePicker(true)}
            />
            {showStartTimePicker && (
              <RNDateTimePicker
                value={startTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={onChangeStartTime}
                minuteInterval={10}
              />
            )}
            <Button
              title="종료 시간"
              onPress={() => setShowEndTimePicker(true)}
            />
            {showEndTimePicker && (
              <RNDateTimePicker
                value={endTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={onChangeEndTime}
                minuteInterval={10}
              />
            )}
            <Button title="저장" onPress={handleSave} />
            <Button
              title="닫기"
              onPress={() => setShowModal(false)}
              color="gray"
            />
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
