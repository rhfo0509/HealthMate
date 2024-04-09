import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Modal, Button, Alert } from "react-native";
import { useUserContext } from "../contexts/UserContext";
import ScheduleListItem from "./ScheduleListItem";
import {
  SwipeableFlatList,
  SwipeableQuickActionButton,
  SwipeableQuickActions,
} from "react-native-swipe-list";
import {
  getMembersByTrainer,
  // addScheduleToMember,
  // addScheduleToTrainer,
} from "../lib/users";
import {
  createSchedule,
  removeSchedule,
  updateSchedule,
} from "../lib/schedules";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { format, parse } from "date-fns";

function ScheduleList({ schedules, ListHeaderComponent }) {
  const [showModal, setShowModal] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const { user: trainer } = useUserContext();

  // const [memberName, setMemberName] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
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
    updateSchedule({
      selectedScheduleId,
      selectedMemberId,
      date,
      startTime,
      endTime,
    });

    setShowModal(false);
    setSelectedMemberId("");
    setDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
  };

  return (
    <>
      <SwipeableFlatList
        data={schedules}
        style={styles.block}
        renderItem={({ item }) => <ScheduleListItem schedule={item} />}
        keyExtractor={(schedule) => schedule.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={ListHeaderComponent}
        renderRightActions={({ item }) => (
          <SwipeableQuickActions>
            <SwipeableQuickActionButton
              onPress={() => {
                Alert.alert(
                  "일정 삭제",
                  "일정을 삭제하시겠습니까?",
                  [
                    {
                      text: "취소",
                      style: "cancel",
                    },
                    {
                      text: "확인",
                      onPress: () => {
                        removeSchedule(item.id);
                      },
                    },
                  ],
                  { cancelable: true }
                );
              }}
              text="삭제"
              textStyle={{ fontWeight: "bold", color: "white" }}
              style={{
                flex: 1,
                paddingHorizontal: 30,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "crimson",
              }}
            />
          </SwipeableQuickActions>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  block: { flex: 1 },
  separator: {
    backgroundColor: "#e0e0e0",
    height: 1,
    width: "100%",
  },
});

export default ScheduleList;
