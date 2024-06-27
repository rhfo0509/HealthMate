import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
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

  const onSave = () => {
    createBodyData({
      memberId,
      date: date ? date : new Date(),
      bodyData,
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
          <Text>날짜를 선택해주세요.</Text>
          <Pressable style={styles.select} onPress={onPressDatePicker}>
            <Text>
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
              <Text>　　체중:</Text>
              <TextInput
                style={styles.input}
                value={bodyData.weight}
                onChangeText={(text) =>
                  setBodyData((prevState) => ({ ...prevState, weight: text }))
                }
                keyboardType="number-pad"
              />
              <Text>(kg)</Text>
            </View>
            <View style={styles.bodyData}>
              <Text>골격근량: </Text>
              <TextInput
                style={styles.input}
                value={bodyData.SMM}
                onChangeText={(text) =>
                  setBodyData((prevState) => ({ ...prevState, SMM: text }))
                }
                keyboardType="number-pad"
              />
              <Text>(kg)</Text>
            </View>
            <View style={styles.bodyData}>
              <Text>체지방률: </Text>
              <TextInput
                style={styles.input}
                value={bodyData.PBF}
                onChangeText={(text) =>
                  setBodyData((prevState) => ({ ...prevState, PBF: text }))
                }
                keyboardType="number-pad"
              />
              <Text>(%)</Text>
            </View>
          </View>
          <View style={styles.buttonGroup}>
            <Pressable onPress={onSave} style={{ padding: 10 }}>
              <Text style={[styles.text, { color: "#64B5F6" }]}>등록</Text>
            </Pressable>
            <Pressable onPress={onClose} style={{ padding: 10 }}>
              <Text style={[styles.text, { color: "#E57373" }]}>취소</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bodyData: {
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
  input: {
    width: "50%",
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderRadius: 5,
    textAlign: "center",
  },
  select: {
    fontSize: 16,
    borderBottomWidth: 1,
    marginHorizontal: 4,
    marginBottom: 10,
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

export default BodyDataModal;
