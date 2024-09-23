import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

import { createBodyData } from "../lib/bodyData";
import { updateUser } from "../lib/users";

function BodyDataModal({ memberId, show, setShow }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(null);
  const [bodyData, setBodyData] = useState({ weight: "", SMM: "", PBF: "" });

  const onPressDatePicker = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (_, selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate);
  };

  const handleNumericInput = (value) => {
    const filteredValue = value.replace(/[^0-9.]/g, "");
    return filteredValue;
  };

  const onSave = () => {
    const { weight, SMM, PBF } = bodyData;

    if (!weight || !SMM || !PBF) {
      Alert.alert("알림", "모든 항목을 입력해주세요.", [{ text: "확인" }]);
      return;
    }

    createBodyData({
      memberId,
      date: date ? date : new Date(),
      bodyData: {
        weight: parseFloat(weight).toFixed(1),
        SMM: parseFloat(SMM).toFixed(1),
        PBF: parseFloat(PBF).toFixed(1),
      },
    });

    updateUser({ memberId, bodyData });

    setDate(null);
    setBodyData({ weight: "", SMM: "", PBF: "" });
    setShow(false);
  };

  const onClose = () => {
    setDate(null);
    setBodyData({ weight: "", SMM: "", PBF: "" });
    setShow(false);
  };

  return (
    <Modal
      visible={show}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>체성분 기록</Text>
          <Pressable style={styles.select} onPress={onPressDatePicker}>
            <Text style={styles.selectText}>
              {date
                ? format(date, "yyyy-MM-dd")
                : format(new Date(), "yyyy-MM-dd")}
            </Text>
          </Pressable>
          {showDatePicker && (
            <RNDateTimePicker
              value={new Date()}
              display="spinner"
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}
          <View style={styles.inputContainer}>
            <View style={styles.bodyData}>
              <Text style={styles.label}>체중:</Text>
              <TextInput
                style={styles.input}
                value={bodyData.weight}
                onChangeText={(text) =>
                  setBodyData((prevState) => ({
                    ...prevState,
                    weight: handleNumericInput(text),
                  }))
                }
                keyboardType="number-pad"
              />
              <Text style={styles.unit}>(kg)</Text>
            </View>
            <View style={styles.bodyData}>
              <Text style={styles.label}>골격근량:</Text>
              <TextInput
                style={styles.input}
                value={bodyData.SMM}
                onChangeText={(text) =>
                  setBodyData((prevState) => ({
                    ...prevState,
                    SMM: handleNumericInput(text),
                  }))
                }
                keyboardType="number-pad"
              />
              <Text style={styles.unit}>(kg)</Text>
            </View>
            <View style={styles.bodyData}>
              <Text style={styles.label}>체지방률:</Text>
              <TextInput
                style={styles.input}
                value={bodyData.PBF}
                onChangeText={(text) =>
                  setBodyData((prevState) => ({
                    ...prevState,
                    PBF: handleNumericInput(text),
                  }))
                }
                keyboardType="number-pad"
              />
              <Text style={styles.unit}>(%)</Text>
            </View>
          </View>
          <View style={styles.modalButtons}>
            <Pressable
              onPress={onSave}
              style={[styles.modalButton, { backgroundColor: "#1f6feb" }]}
            >
              <Text style={{ color: "#fff" }}>등록</Text>
            </Pressable>
            <Pressable onPress={onClose} style={styles.modalButton}>
              <Text style={{ color: "#1f6feb" }}>취소</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  select: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    alignSelf: "stretch",
    alignItems: "center",
  },
  selectText: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  bodyData: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
    width: 80,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 16,
  },
  unit: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 12,
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

export default BodyDataModal;
