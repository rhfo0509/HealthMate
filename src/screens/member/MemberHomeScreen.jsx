import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, View, Text, Modal, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import PagerView from "react-native-pager-view";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserContext } from "../../contexts/UserContext";
import Avatar from "../../components/Avatar";
import { getMemberSchedules } from "../../lib/schedules";
import { getMembershipsByMember } from "../../lib/memberships";
import { format, isAfter } from "date-fns";
import { ko } from "date-fns/locale";
import { getUser } from "../../lib/users";
import IconRightButton from "../../components/IconRightButton";
import { TextInput } from "react-native";
import { createNotification } from "../../lib/notifications";
import MembershipCard from "../../components/MembershipCard";

function MemberHomeScreen() {
  const navigation = useNavigation();
  const { user } = useUserContext();
  const [scheduleList, setScheduleList] = useState([]);
  const [membershipList, setMembershipList] = useState([]);
  const [showFirst, setShowFirst] = useState([false, false, false]);
  const [showSecond, setShowSecond] = useState([false, false, false]);
  const [showDatePicker, setShowDatePicker] = useState([false, false, false]);
  const [showTimePicker, setShowTimePicker] = useState([false, false, false]);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    getMembershipsByMember(user.id).then((memberships) => {
      Promise.all(
        memberships.map(async (membership) => {
          const trainer = await getUser(membership.trainerId);
          return { ...membership, trainer };
        })
      ).then((membershipsWithTrainer) => {
        setMembershipList(membershipsWithTrainer);
      });
    });
    getMemberSchedules(user.id).then((schedules) => {
      const futureSchedules = schedules.filter((schedule) =>
        isAfter(new Date(schedule.date), new Date())
      );
      futureSchedules.sort((a, b) => {
        const diffA = Math.abs(new Date() - new Date(a.date));
        const diffB = Math.abs(new Date() - new Date(b.date));
        return diffA - diffB;
      });
      Promise.all(
        futureSchedules.slice(0, 3).map(async (schedule) => {
          const trainer = await getUser(schedule.trainerId);
          return { ...schedule, trainer };
        })
      ).then((schedulesWithTrainers) => {
        setScheduleList(schedulesWithTrainers);
      });
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: "홈",
      headerRight: () => (
        <IconRightButton onPress={onPress} name="notifications-none" />
      ),
    });
  }, [navigation]);

  const onPress = () => {
    navigation.navigate("Notify");
  };

  const onPressFirst = (scheduleIndex) => {
    setShowFirst((prevState) => {
      const newState = prevState.map((value, index) =>
        index === scheduleIndex ? true : false
      );
      return newState;
    });
  };

  const onPressSecond = (scheduleIndex) => {
    setShowSecond((prevState) => {
      const newState = prevState.map((value, index) =>
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
    const message = `${user.displayName}님이 ${schedule.date} ${schedule.startTime} 에서 ${data.updatedField.date} ${data.updatedField.startTime} 으로 일정 변경을 신청하였습니다.`;
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
            setReason("");
            setDate(null);
            setTime(null);
            setShowFirst([false, false, false]);
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
            setReason("");
            setShowSecond([false, false, false]);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onPressDatePicker = (scheduleIndex) => {
    setShowDatePicker((prevState) => {
      const newState = prevState.map((value, index) =>
        index === scheduleIndex ? true : false
      );
      return newState;
    });
  };

  const onPressTimePicker = (scheduleIndex) => {
    setShowTimePicker((prevState) => {
      const newState = prevState.map((value, index) =>
        index === scheduleIndex ? true : false
      );
      return newState;
    });
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker([false, false, false]);
    setDate(format(selectedDate, "yyyy-MM-dd"));
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker([false, false, false]);
    setTime(format(selectedTime, "HH:mm"));
  };

  return (
    <View style={styles.block}>
      <View style={styles.title}>
        <Text style={styles.titleText}>나의 회원권</Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ alignSelf: "center" }}>
          <MaterialIcons name="chevron-left" size={24} color="black" />
        </View>
        <PagerView style={styles.pagerView} initialPage={0}>
          {membershipList.map((membership, index) => (
            <MembershipCard membership={membership} key={index} />
          ))}
        </PagerView>
        <View style={{ alignSelf: "center" }}>
          <MaterialIcons name="chevron-right" size={24} color="black" />
        </View>
      </View>

      <View style={styles.title}>
        <Text style={styles.titleText}>다가오는 일정</Text>
      </View>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 2,
              }}
            >
              <Text style={styles.itemText}>
                {format(new Date(schedule.date), "M/d(E)", { locale: ko })}{" "}
                {schedule.startTime}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Pressable
              style={[styles.button, styles.requestButton]}
              android_ripple={{ color: "#ededed" }}
              onPress={() => onPressFirst(index)}
            >
              <Text style={[styles.itemText, styles.requestText]}>
                변경신청
              </Text>
            </Pressable>
            <Modal
              visible={showFirst[index]}
              animationType="fade"
              transparent={true}
              onRequestClose={onCloseFirst}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View>
                    <Text>날짜 및 시간을 클릭하여 일정을 선택해주세요.</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Pressable
                      style={styles.select}
                      onPress={() => onPressDatePicker(index)}
                    >
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
                    <Pressable
                      style={styles.select}
                      onPress={() => onPressTimePicker(index)}
                    >
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      style={styles.input}
                      placeholder="변경 사유를 입력하세요."
                      value={reason}
                      onChangeText={setReason}
                    />
                  </View>
                  <View style={styles.modalButtons}>
                    <Pressable
                      onPress={() => onSaveFirst(schedule)}
                      style={[
                        styles.modalButton,
                        { backgroundColor: "#1f6feb" },
                      ]}
                    >
                      <Text style={{ color: "#fff" }}>등록</Text>
                    </Pressable>
                    <Pressable
                      onPress={onCloseFirst}
                      style={styles.modalButton}
                    >
                      <Text style={{ color: "#1f6feb" }}>취소</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
            <Pressable
              style={[styles.button, styles.cancelRequestButton]}
              android_ripple={{ color: "#ededed" }}
              onPress={() => onPressSecond(index)}
            >
              <Text style={[styles.itemText, styles.cancelRequestText]}>
                취소신청
              </Text>
            </Pressable>
            <Modal
              visible={showSecond[index]}
              animationType="fade"
              transparent={true}
              onRequestClose={onCloseSecond}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      style={styles.input}
                      placeholder="취소 사유를 입력하세요."
                      value={reason}
                      onChangeText={setReason}
                    />
                  </View>
                  <View style={styles.modalButtons}>
                    <Pressable
                      onPress={() => onSaveSecond(schedule)}
                      style={[
                        styles.modalButton,
                        { backgroundColor: "#1f6feb" },
                      ]}
                    >
                      <Text style={{ color: "#fff" }}>등록</Text>
                    </Pressable>
                    <Pressable
                      onPress={onCloseSecond}
                      style={styles.modalButton}
                    >
                      <Text style={{ color: "#1f6feb" }}>취소</Text>
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
  pagerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginHorizontal: 24,
  },
  block: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  titleText: {
    fontWeight: "500",
    fontSize: 24,
  },
  item: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eeeeee",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  itemText: {
    fontSize: 16,
    marginVertical: 4,
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  requestButton: {
    backgroundColor: "#1f6feb",
  },
  requestText: {
    color: "#fff",
  },
  cancelRequestButton: {
    backgroundColor: "#fff",
    borderColor: "#1f6feb",
    borderWidth: 1,
  },
  cancelRequestText: {
    color: "#1f6feb",
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderRadius: 5,
  },
  select: {
    fontSize: 16,
    borderBottomWidth: 1,
    marginHorizontal: 4,
    marginBottom: 10,
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
    borderColor: "#1f6feb",
  },
});

export default MemberHomeScreen;
