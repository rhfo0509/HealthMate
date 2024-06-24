import React from "react";
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
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View
            style={{
              position: "absolute",
              top: 15,
              left: 22,
            }}
          >
            <Text style={{ fontSize: 24 }}>회원 및 회원권 등록</Text>
          </View>
          <BorderedInput
            hasMarginBottom
            placeholder="이름"
            value={memberName}
            onChangeText={setMemberName}
          />
          <BorderedInput
            placeholder="전화번호 (숫자만 입력)"
            value={memberPhoneNumber}
            onChangeText={setMemberPhoneNumber}
            keyboardType="number-pad"
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>시작일자</Text>
            <TextInput
              style={styles.input}
              placeholder="년"
              value={membershipInfo.startYear}
              onChangeText={(text) =>
                setMembershipInfo((prevInfo) => ({
                  ...prevInfo,
                  startYear: text,
                }))
              }
              keyboardType="numeric"
              maxLength={4}
            />
            <TextInput
              style={styles.input}
              placeholder="월"
              value={membershipInfo.startMonth}
              onChangeText={(text) =>
                setMembershipInfo((prevInfo) => ({
                  ...prevInfo,
                  startMonth: text,
                }))
              }
              keyboardType="numeric"
              maxLength={2}
            />
            <TextInput
              style={styles.input}
              placeholder="일"
              value={membershipInfo.startDay}
              onChangeText={(text) =>
                setMembershipInfo((prevInfo) => ({
                  ...prevInfo,
                  startDay: text,
                }))
              }
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>횟수</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              maxLength={2}
              onChangeText={(text) => {
                setMembershipInfo((prevInfo) => ({
                  ...prevInfo,
                  count: text,
                }));
              }}
            />
            <Text>회</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              bottom: 10,
              right: 10,
            }}
          >
            <Pressable onPress={onPressNext} style={{ padding: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>다음</Text>
            </Pressable>
            <Pressable onPress={onPressClose} style={{ padding: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>취소</Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 60,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
});

export default MemberModal;
