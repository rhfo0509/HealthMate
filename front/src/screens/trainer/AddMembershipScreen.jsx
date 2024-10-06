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
import {
  addMemberToTrainer,
  getMember,
  getMembersByTrainer,
} from "../../lib/users";
import { createMembership, getMembership } from "../../lib/memberships";
import { useUserContext } from "../../contexts/UserContext";
import BorderedInput from "../../components/BorderedInput";
import IconRightButton from "../../components/IconRightButton";
import { createSchedulesWithMembership } from "../../lib/schedules";

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
    count: "10", // Default count set to 10
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

  const onSearchMember = async () => {
    const profile = {
      displayName: memberName,
      phoneNumber: memberPhoneNumber,
    };
    const member = await getMember(profile);
    const existingMembers = await getMembersByTrainer(trainer.id);
    const isAlreadyRegistered = existingMembers.some(
      (existingMember) =>
        existingMember.displayName === memberName &&
        existingMember.phoneNumber === memberPhoneNumber
    );

    if (isAlreadyRegistered) {
      Alert.alert("알림", "이미 등록된 회원입니다.");
      return;
    }

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
    } else {
      Alert.alert("알림", "해당 회원이 존재하지 않습니다.");
    }
  };

  const onSubmit = async () => {
    // Validate that all checked days have a time selected
    const invalidSchedules = Object.entries(newSchedule.days).some(
      ([, { checked, time }]) => checked && !time
    );

    if (invalidSchedules) {
      Alert.alert("알림", "체크된 요일의 시간을 모두 입력해 주세요.");
      return;
    }

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

    // Add member to trainer
    await addMemberToTrainer(trainer.id, memberId);

    // Create membership separately
    createMembership({
      ...formattedMembershipInfo,
      memberId,
      trainerId: trainer.id,
    })
      .then((membershipDoc) => {
        return getDoc(membershipDoc);
      })
      .then((snapshot) => {
        return createSchedulesWithMembership({
          ...snapshot.data(),
          id: snapshot.id,
        });
      })
      .then(() => {
        Alert.alert("알림", "회원권과 스케줄이 성공적으로 생성되었습니다.", [
          {
            text: "확인",
            onPress: () => navigation.goBack(),
          },
        ]);
      })
      .catch((error) => {
        console.error("회원권 생성 중 오류 발생:", error);
      });

    // Reset state after successful submission
    setMemberName("");
    setMemberPhoneNumber("");
    setShowMembershipFields(false);
    setIsMemberVerified(false);
    setMembershipInfo({
      startDate: new Date(),
      count: "10",
      schedules: [],
    });
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
                      !checked && styles.disabledButton, // Disable time picker when day is not checked
                    ]}
                    onPress={() => checked && showTimePickerForDay(day)} // Only show time picker if checked
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
    borderRadius: 8,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#3182ce",
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
