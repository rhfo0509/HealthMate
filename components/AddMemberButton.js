// User가 Trainer인 경우에만 버튼 활성화

import React, { useState } from "react";
import { View, Pressable, StyleSheet, Modal, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserContext } from "../contexts/UserContext";
import { addMemberToTrainer } from "../lib/users";
import BorderedInput from "./BorderedInput";

function AddMemberButton() {
  const [show, setShow] = useState(false);
  // const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhoneNumber, setMemberPhoneNumber] = useState("");
  const { user: trainer } = useUserContext();

  const handleSave = () => {
    // 트레이너의 회원 목록에 새 회원 추가
    addMemberToTrainer(trainer.id, {
      name: memberName,
      phoneNumber: memberPhoneNumber,
    });
    setMemberName("");
    setMemberPhoneNumber("");
    setShow(false);
  };

  const handleClose = () => {
    setMemberName("");
    setMemberPhoneNumber("");
    setShow(false);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.circle} onPress={() => setShow(true)}>
        <MaterialIcons name="person-add" size={24} color="white" />
      </Pressable>
      <Modal
        visible={show}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShow(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{
                position: "absolute",
                top: 15,
                left: 22,
              }}
            >
              <Text style={{ fontSize: 24 }}>회원 추가</Text>
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

export default AddMemberButton;
