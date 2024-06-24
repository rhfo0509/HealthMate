import React, { useState, useEffect } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";

import { useUserContext } from "../contexts/UserContext";
import { getMembersByTrainer } from "../lib/users";
import { createSchedule } from "../lib/schedules";

import ScheduleModal from "./ScheduleModal";

function AddScheduleButton({ selectedDate }) {
  const { user: trainer } = useUserContext();
  const [showModal, setShowModal] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    getMembersByTrainer(trainer.id).then(setMemberList);
  }, []);

  const onPressSave = () => {
    createSchedule({
      memberId,
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

  const onPressClose = () => {
    setSelectedMemberId("");
    setDate(null);
    setStartTime(null);
    setEndTime(null);
    setShowModal(false);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.circle} onPress={() => setShowModal(true)}>
        <MaterialIcons name="event" size={24} color="white" />
      </Pressable>
      <ScheduleModal
        visible={showModal}
        onPressSave={onPressSave}
        onPressClose={onPressClose}
        memberId={memberId}
        setMemberId={setMemberId}
        memberList={memberList}
        date={date}
        setDate={setDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        selectedDate={selectedDate}
      />
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
    backgroundColor: "royalblue",
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

export default AddScheduleButton;
