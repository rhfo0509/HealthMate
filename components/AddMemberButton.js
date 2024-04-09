// User가 Trainer인 경우에만 버튼 활성화

import React, { useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Modal,
  Button,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserContext } from "../contexts/UserContext";
import { addMemberToTrainer } from "../lib/users";

function AddMemberButton() {
  const [show, setShow] = useState(false);
  const [memberId, setMemberId] = useState("");
  const { user: trainer } = useUserContext();

  const onPress = () => {
    // 트레이너의 회원 목록에 새 회원 추가
    addMemberToTrainer(trainer.id, memberId);
    setMemberId("");
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
            <TextInput
              style={styles.input}
              placeholder="Enter Member ID"
              value={memberId}
              onChangeText={setMemberId}
            />
            <Button title="Add Member" onPress={onPress} />
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
});

export default AddMemberButton;
