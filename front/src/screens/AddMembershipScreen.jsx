import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CheckBox } from "react-native-elements";
import { getDoc } from "firebase/firestore";

import { useUserContext } from "../contexts/UserContext";
import {
  addMemberToTrainer,
  getMember,
  getMembersByTrainer,
} from "../lib/users";
import { createMembership, getMembership } from "../lib/memberships";
import { createSchedulesWithMembership } from "../lib/schedules";
import BorderedInput from "../components/BorderedInput";
import IconRightButton from "../components/IconRightButton";

function AddMembershipScreen() {
  const navigation = useNavigation();
  const { user: trainer } = useUserContext();

  const [memberName, setMemberName] = useState("");
  const [memberPhoneNumber, setMemberPhoneNumber] = useState("");
  const [memberId, setMemberId] = useState(null);
  const [showMembershipFields, setShowMembershipFields] = useState(false);
  const [isMemberVerified, setIsMemberVerified] = useState(false);
  const [membershipInfo, setMembershipInfo] = useState({
    startDate: new Date(),
    count: "10",
    schedules: [],
  });
  const [newSchedule, setNewSchedule] = useState({
    days: {
      월: { checked: false, time: null },
      화: { checked: false, time: null },
      수: { checked: false, time: null },
      목: { checked: false, time: null },
      금: { checked: false, time: null },
      토: { checked: false, time: null },
      일: { checked: false, time: null },
    },
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState({
    visible: false,
    day: null,
  });

  // 회원 검색 함수
  const onSearchMember = async () => {
    const profile = {
      displayName: memberName,
      phoneNumber: memberPhoneNumber,
    };
    const member = await getMember(profile);
    const existingMembers = await getMembersByTrainer(trainer.id);

    // 이미 트레이너의 회원으로 등록되었는지 확인
    const isAlreadyRegistered = existingMembers.some(
      (existingMember) =>
        existingMember.displayName === memberName &&
        existingMember.phoneNumber === memberPhoneNumber
    );

    if (isAlreadyRegistered) {
      Alert.alert("알림", "이미 등록된 회원입니다.");
      return;
    }

    // 회원이 다른 트레이너의 회원인지 확인
    if (member) {
      const membership = await getMembership(member.id);

      if (membership) {
        Alert.alert("알림", "해당 회원은 이미 회원권을 보유하고 있습니다.");
        return;
      }
      setShowMembershipFields(true);
      setIsMemberVerified(true);
      setMemberId(member.id);
      Alert.alert("알림", "회원이 확인되었습니다.");
    }
    // 회원이 존재하는지 확인
    else {
      Alert.alert("알림", "해당 회원이 존재하지 않습니다.");
    }
  };

  // 회원권 및 일정 생성
  const onSubmit = async () => {
    const invalidSchedules = Object.entries(newSchedule.days).some(
      ([, { checked, time }]) => checked && !time
    );

    // 체크된 요일에 시간이 없는 경우 Alert
    if (invalidSchedules) {
      Alert.alert("알림", "체크된 요일의 시간을 모두 입력해 주세요.");
      return;
    }

    // 회원권 정보 포맷팅
    const formattedMembershipInfo = {
      ...membershipInfo,
      count: +membershipInfo.count,
      startDate: membershipInfo.startDate.toISOString().split("T")[0],
      schedules: Object.entries(newSchedule.days)
        .filter(([_, { checked }]) => checked)
        .map(([day, { time }]) => ({
          day,
          startTime: `${time.getHours()}:${time
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
        })),
    };

    try {
      // 트레이너에 회원 추가
      await addMemberToTrainer(trainer.id, memberId);

      // 회원권 생성
      const membershipDoc = await createMembership({
        ...formattedMembershipInfo,
        memberId,
        trainerId: trainer.id,
      });
      const snapshot = await getDoc(membershipDoc);

      // 생성된 회원권의 정보를 이용해 스케줄 생성
      await createSchedulesWithMembership({
        ...snapshot.data(),
        id: snapshot.id,
      });

      Alert.alert("알림", "회원권과 스케줄이 성공적으로 생성되었습니다.", [
        { text: "확인", onPress: () => navigation.goBack() },
      ]);

      // 성공 후 상태 초기화
      resetForm();
    } catch (error) {
      console.error("회원권 생성 중 오류 발생:", error);
    }
  };

  // 폼 리셋 함수
  const resetForm = () => {
    setMemberName("");
    setMemberPhoneNumber("");
    setShowMembershipFields(false);
    setIsMemberVerified(false);
    setMembershipInfo({ startDate: new Date(), count: "10", schedules: [] });
    setNewSchedule({
      days: {
        월: { checked: false, time: null },
        화: { checked: false, time: null },
        수: { checked: false, time: null },
        목: { checked: false, time: null },
        금: { checked: false, time: null },
        토: { checked: false, time: null },
        일: { checked: false, time: null },
      },
    });
  };

  // 요일 토글 함수
  const toggleDay = (day) => {
    setNewSchedule((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: { ...prev.days[day], checked: !prev.days[day].checked },
      },
    }));
  };

  const showTimePickerForDay = (day) => {
    setShowTimePicker({ visible: true, day });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="send" />,
    });
  }, [navigation, onSubmit]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text style={styles.header}>회원 정보 입력</Text>
      <View style={styles.inputWrapper}>
        <BorderedInput
          placeholder="이름"
          value={memberName}
          onChangeText={setMemberName}
          editable={!isMemberVerified}
        />
        <BorderedInput
          placeholder="전화번호 (숫자만 입력)"
          value={memberPhoneNumber}
          onChangeText={setMemberPhoneNumber}
          keyboardType="number-pad"
          editable={!isMemberVerified}
        />
        <Pressable
          style={[
            styles.button,
            isMemberVerified ? styles.disabledButton : styles.activeButton,
          ]}
          onPress={onSearchMember}
          disabled={isMemberVerified}
        >
          <Text style={styles.buttonText}>확인</Text>
        </Pressable>
      </View>

      {showMembershipFields && (
        <>
          <Text style={styles.header}>회원권 정보 입력</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inlineInputs}>
              <Text style={styles.label}>횟수:</Text>
              <BorderedInput
                placeholder="횟수 입력"
                value={membershipInfo.count}
                onChangeText={(text) =>
                  setMembershipInfo((prev) => ({ ...prev, count: text }))
                }
                keyboardType="numeric"
              />
              <Text style={{ marginLeft: 16 }}>회</Text>
            </View>
            <View style={styles.inlineInputs}>
              <Text style={styles.label}>시작일자:</Text>
              <Pressable
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  {membershipInfo.startDate.toLocaleDateString()}
                </Text>
              </Pressable>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={membershipInfo.startDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    setMembershipInfo((prev) => ({
                      ...prev,
                      startDate: date,
                    }));
                  }
                }}
              />
            )}

            <View style={styles.scheduleHeader}>
              <Text style={styles.subHeader}>일정 추가</Text>
            </View>

            {Object.entries(newSchedule.days).map(
              ([day, { checked, time }]) => (
                <View key={day} style={styles.scheduleRow}>
                  <CheckBox
                    checked={checked}
                    onPress={() => toggleDay(day)}
                    containerStyle={styles.checkBox}
                  />
                  <Text style={styles.dayText}>{day}</Text>
                  <Pressable
                    style={[
                      styles.timePickerButton,
                      !checked && styles.disabledButton,
                    ]}
                    onPress={() => checked && showTimePickerForDay(day)}
                  >
                    <Text style={styles.datePickerText}>
                      {time
                        ? time.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "시간 선택"}
                    </Text>
                  </Pressable>
                </View>
              )
            )}
          </View>
        </>
      )}

      {showTimePicker.visible && (
        <DateTimePicker
          value={newSchedule.days[showTimePicker.day]?.time || new Date()}
          mode="time"
          display="spinner"
          minuteInterval={30}
          onChange={(event, time) => {
            if (event.type !== "dismissed") {
              setNewSchedule((prev) => ({
                ...prev,
                days: {
                  ...prev.days,
                  [showTimePicker.day]: {
                    ...prev.days[showTimePicker.day],
                    time,
                  },
                },
              }));
            }
            setShowTimePicker({ visible: false, day: null });
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f1f5f9",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2d3748",
  },
  inputWrapper: {
    marginBottom: 20,
    gap: 10,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#1f6feb",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#cbd5e0",
  },
  inlineInputs: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    width: 70,
    fontSize: 16,
    color: "#2d3748",
    marginRight: 10,
  },
  datePickerButton: {
    flex: 1,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#cbd5e0",
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  datePickerText: {
    color: "#4a5568",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
    color: "#4a5568",
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#e2e8f0",
  },
  checkBox: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
  },
  dayText: {
    fontSize: 16,
    marginRight: 15,
    marginBottom: 5,
    color: "#2d3748",
  },
  timePickerButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e0",
    backgroundColor: "#ffffff",
    flex: 1,
    alignItems: "center",
  },
});

export default AddMembershipScreen;
