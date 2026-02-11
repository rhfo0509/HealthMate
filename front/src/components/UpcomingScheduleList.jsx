import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { createNotification } from "../lib/notifications";
import Avatar from "./Avatar";
import { colors } from "../styles/theme";

function UpcomingScheduleList({ scheduleList, user }) {
  const [showFirst, setShowFirst] = useState([false, false, false]);
  const [showSecond, setShowSecond] = useState([false, false, false]);
  const [showDatePicker, setShowDatePicker] = useState([false, false, false]);
  const [showTimePicker, setShowTimePicker] = useState([false, false, false]);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [reason, setReason] = useState("");

  const onPressFirst = (scheduleIndex) => {
    setShowFirst((prevState) => {
      const newState = prevState.map((_, index) =>
        index === scheduleIndex ? true : false
      );
      return newState;
    });
  };

  const onPressSecond = (scheduleIndex) => {
    setShowSecond((prevState) => {
      const newState = prevState.map((_, index) =>
        index === scheduleIndex ? true : false
      );
      return newState;
    });
  };

  const onCloseFirst = () => {
    setReason("");
    setDate(null);
    setTime(null);
    setShowFirst([false, false, false]);
  };

  const onSaveFirst = (schedule) => {
    const senderId = schedule.memberId;
    const receiverId = schedule.trainerId;
    const data = {
      reason: reason,
      scheduleId: schedule.id,
      updatedField: {
        date: date ? date : schedule.date,
        startTime: time ? time : schedule.startTime,
      },
    };
    const message = `${user.displayName}님이 ${schedule.date} ${schedule.startTime} 일정 변경을 신청하였습니다.`;
    Alert.alert(
      null,
      "정말로 변경 신청하시겠습니까?",
      [
        {
          text: "아니오",
          style: "cancel",
        },
        {
          text: "네",
          onPress: () => {
            createNotification({ senderId, receiverId, message, data });
            onCloseFirst();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onCloseSecond = () => {
    setReason("");
    setShowSecond([false, false, false]);
  };

  const onSaveSecond = (schedule) => {
    const senderId = schedule.memberId;
    const receiverId = schedule.trainerId;
    const data = {
      reason: reason,
      scheduleId: schedule.id,
    };
    const message = `${user.displayName}님이 ${schedule.date} ${schedule.startTime} 일정 취소를 신청하였습니다.`;
    Alert.alert(
      null,
      "정말로 취소 신청하시겠습니까?",
      [
        {
          text: "아니오",
          style: "cancel",
        },
        {
          text: "네",
          onPress: () => {
            createNotification({ senderId, receiverId, message, data });
            onCloseSecond();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onPressDatePicker = (scheduleIndex) => {
    setShowDatePicker((prevState) => {
      const newState = prevState.map((_, index) =>
        index === scheduleIndex ? true : false
      );
      return newState;
    });
  };

  const onPressTimePicker = (scheduleIndex) => {
    setShowTimePicker((prevState) => {
      const newState = prevState.map((_, index) =>
        index === scheduleIndex ? true : false
      );
      return newState;
    });
  };

  const onChangeDate = (_, selectedDate) => {
    setShowDatePicker([false, false, false]);
    setDate(format(selectedDate, "yyyy-MM-dd"));
  };

  const onChangeTime = (_, selectedTime) => {
    setShowTimePicker([false, false, false]);
    setTime(format(selectedTime, "HH:mm"));
  };

  return (
    <View>
      <Text style={styles.titleText}>다가오는 일정</Text>
      {scheduleList.map((schedule, index) => (
        <View key={schedule.id} style={styles.item}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Avatar
                source={
                  schedule.trainer.photoURL && {
                    uri: schedule.trainer.photoURL,
                  }
                }
              />
              <Text style={styles.itemText}>
                {" "}
                {schedule.trainer.displayName} 트레이너
              </Text>
            </View>
            <Text style={styles.itemText}>
              {format(new Date(schedule.date), "M/d(E)", { locale: ko })}{" "}
              {schedule.startTime}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => onPressFirst(index)}
              style={[styles.button, styles.requestButton]}
            >
              <Text style={[styles.itemText, styles.requestText]}>
                변경신청
              </Text>
            </Pressable>
            <Modal
              visible={showFirst[index]}
              animationType="fade"
              transparent={true}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text>날짜 및 시간을 선택해주세요.</Text>
                  <View style={styles.datetime}>
                    <Pressable onPress={() => onPressDatePicker(index)}>
                      <Text style={styles.itemText}>
                        {date ? date : schedule.date}
                      </Text>
                    </Pressable>
                    {showDatePicker[index] && (
                      <RNDateTimePicker
                        value={new Date(schedule.date)}
                        display="spinner"
                        onChange={onChangeDate}
                        minimumDate={new Date()}
                      />
                    )}
                    <Pressable onPress={() => onPressTimePicker(index)}>
                      <Text style={styles.itemText}>
                        {time ? time : schedule.startTime}
                      </Text>
                    </Pressable>
                    {showTimePicker[index] && (
                      <RNDateTimePicker
                        value={
                          new Date(schedule.date + "T" + schedule.startTime)
                        }
                        display="spinner"
                        onChange={onChangeTime}
                        mode="time"
                        is24Hour={true}
                        minuteInterval={30}
                      />
                    )}
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="변경 사유를 입력하세요"
                    value={reason}
                    onChangeText={setReason}
                  />
                  <View style={styles.modalButtons}>
                    <Pressable
                      onPress={() => onSaveFirst(schedule)}
                      style={[
                        styles.modalButton,
                        { backgroundColor: colors.primary[500] },
                      ]}
                    >
                      <Text style={{ color: colors.background }}>등록</Text>
                    </Pressable>
                    <Pressable
                      onPress={onCloseFirst}
                      style={styles.modalButton}
                    >
                      <Text style={{ color: colors.primary[500] }}>취소</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>

            <Pressable
              onPress={() => onPressSecond(index)}
              style={[styles.button, styles.cancelRequestButton]}
            >
              <Text style={[styles.itemText, styles.cancelRequestText]}>
                취소신청
              </Text>
            </Pressable>
            <Modal
              visible={showSecond[index]}
              animationType="fade"
              transparent={true}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TextInput
                    style={styles.input}
                    placeholder="취소 사유를 입력하세요"
                    value={reason}
                    onChangeText={setReason}
                  />
                  <View style={styles.modalButtons}>
                    <Pressable
                      onPress={() => onSaveSecond(schedule)}
                      style={[
                        styles.modalButton,
                        { backgroundColor: colors.primary[500] },
                      ]}
                    >
                      <Text style={{ color: colors.background }}>등록</Text>
                    </Pressable>
                    <Pressable
                      onPress={onCloseSecond}
                      style={styles.modalButton}
                    >
                      <Text style={{ color: colors.primary[500] }}>취소</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontFamily: "Cafe24Ssurround",
    fontSize: 24,
    color: colors.primary[500],
    padding: 12,
  },
  item: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.light,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  datetime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  itemText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 2,
    gap: 8,
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 4,
  },
  requestButton: {
    backgroundColor: colors.primary[500],
  },
  requestText: {
    color: colors.background,
  },
  cancelRequestButton: {
    backgroundColor: colors.background,
    borderColor: colors.primary[500],
    borderWidth: 1,
  },
  cancelRequestText: {
    color: colors.primary[500],
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
});

export default UpcomingScheduleList;
