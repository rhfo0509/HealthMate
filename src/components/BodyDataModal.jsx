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

  const isNumeric = (value) => {
    return /^-?\d+(\.\d+)?$/.test(value);
  };

  const onSave = () => {
    const { weight, SMM, PBF } = bodyData;

    if (!weight || !SMM || !PBF) {
      Alert.alert("알림", "모든 항목을 입력해주세요.", [{ text: "확인" }]);
      return;
    }

    if (!isNumeric(weight) || !isNumeric(SMM) || !isNumeric(PBF)) {
      Alert.alert(
        "알림",
        "체중, 골격근량, 체지방률은 숫자 형식으로 입력해주세요.",
        [{ text: "확인" }]
      );
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
          <Text style={styles.subTitle}>날짜를 선택해주세요.</Text>
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
          <View>
            <View style={styles.bodyData}>
              <Text style={styles.label}>체중:</Text>
              <TextInput
                style={styles.input}
                value={bodyData.weight}
                onChangeText={(text) =>
                  setBodyData((prevState) => ({ ...prevState, weight: text }))
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
                  setBodyData((prevState) => ({ ...prevState, SMM: text }))
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
                  setBodyData((prevState) => ({ ...prevState, PBF: text }))
                }
                keyboardType="number-pad"
              />
              <Text style={styles.unit}>(%)</Text>
            </View>
          </View>
          <View style={styles.buttonGroup}>
            <Pressable onPress={onSave} style={styles.saveButton}>
              <Text style={styles.saveText}>등록</Text>
            </Pressable>
            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>취소</Text>
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
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  subTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  select: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  selectText: {
    fontSize: 16,
    color: "#333",
  },
  bodyData: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    width: 80,
  },
  input: {
    width: "40%",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 16,
    marginRight: 10,
  },
  unit: {
    fontSize: 16,
    color: "#666",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#64B5F6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  cancelButton: {
    backgroundColor: "#E57373",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default BodyDataModal;
