import React, { useRef } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Modal,
  Text,
  TextInput,
} from "react-native";
import BorderedInput from "./BorderedInput";

function MemberModal({
  visible,
  onPressNext,
  onPressClose,
  memberName,
  setMemberName,
  memberPhoneNumber,
  setMemberPhoneNumber,
  membershipInfo,
  setMembershipInfo,
}) {
  const phoneNumberRef = useRef();
  const yearRef = useRef();
  const monthRef = useRef();
  const dayRef = useRef();
  const countRef = useRef();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onPressClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <BorderedInput
            hasMarginBottom
            placeholder="이름"
            value={memberName}
            onChangeText={setMemberName}
            returnKeyType="next"
            onSubmitEditing={() => phoneNumberRef.current.focus()}
          />
          <BorderedInput
            placeholder="전화번호 (숫자만 입력)"
            value={memberPhoneNumber}
            onChangeText={setMemberPhoneNumber}
            keyboardType="number-pad"
            returnKeyType="next"
            ref={phoneNumberRef}
            onSubmitEditing={() => yearRef.current.focus()}
          />
          <View style={styles.inputGroup}>
            <Text>시작일자</Text>
            <TextInput
              style={styles.input}
              placeholder="년"
              maxLength={4}
              value={membershipInfo.startYear}
              onChangeText={(text) =>
                setMembershipInfo((prevInfo) => ({
                  ...prevInfo,
                  startYear: text,
                }))
              }
              keyboardType="numeric"
              returnKeyType="next"
              ref={yearRef}
              onSubmitEditing={() => monthRef.current.focus()}
            />
            <TextInput
              style={styles.input}
              placeholder="월"
              maxLength={2}
              value={membershipInfo.startMonth}
              onChangeText={(text) =>
                setMembershipInfo((prevInfo) => ({
                  ...prevInfo,
                  startMonth: text,
                }))
              }
              keyboardType="numeric"
              returnKeyType="next"
              ref={monthRef}
              onSubmitEditing={() => dayRef.current.focus()}
            />
            <TextInput
              style={styles.input}
              placeholder="일"
              maxLength={2}
              value={membershipInfo.startDay}
              onChangeText={(text) =>
                setMembershipInfo((prevInfo) => ({
                  ...prevInfo,
                  startDay: text,
                }))
              }
              keyboardType="numeric"
              returnKeyType="next"
              ref={dayRef}
              onSubmitEditing={() => countRef.current.focus()}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>횟수</Text>
            <TextInput
              style={styles.input}
              maxLength={2}
              onChangeText={(text) => {
                setMembershipInfo((prevInfo) => ({
                  ...prevInfo,
                  count: text,
                }));
              }}
              keyboardType="numeric"
              returnKeyType="done"
              ref={countRef}
            />
            <Text>회</Text>
          </View>
          <View style={styles.buttonGroup}>
            <Pressable onPress={onPressNext} style={[{ padding: 10 }]}>
              <Text style={[styles.text, { color: "#64B5F6" }]}>다음</Text>
            </Pressable>
            <Pressable onPress={onPressClose} style={{ padding: 10 }}>
              <Text style={[styles.text, { color: "#E57373" }]}>취소</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "24%",
    borderWidth: 1,
    borderColor: "#bdbdbd",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 7,
    marginVertical: 15,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
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

export default MemberModal;
