import React, { useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Modal,
  Button,
  TextInput,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";
import { addMemberToTrainer } from "../lib/users";

const TABBAR_HEIGHT = 49;

const imagePickerOption = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  maxWidth: 768,
  maxHeight: 768,
};

function AddMemberButton() {
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const [memberId, setMemberId] = useState("");
  const { user: trainer } = useUserContext();

  const onPress = () => {
    setShow(true);
  };
  const onSubmit = () => {
    addMemberToTrainer(trainer.id, memberId);
    setMemberId("");
    setShow(false); // Modal 닫기
  };
  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.circle} onPress={onPress}>
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
            <Button title="Add Member" onPress={onSubmit} />
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
    bottom: TABBAR_HEIGHT + 10,
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
