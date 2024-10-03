import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { format } from "date-fns";
import { createBodyData, updateBodyData } from "../lib/bodyData";
import { updateUser } from "../lib/users";

function BodyDataModal({ memberId, show, setShow, editData, latestData }) {
  const [date, setDate] = useState(new Date());
  const [bodyData, setBodyData] = useState({ weight: "", SMM: "", PBF: "" });

  // 수정할 데이터가 있으면 미리 값을 설정
  useEffect(() => {
    if (editData) {
      setDate(editData.date.toDate()); // 날짜는 변경 불가 (읽기 전용)
      setBodyData({
        weight: String(editData.weight),
        SMM: String(editData.SMM),
        PBF: String(editData.PBF),
      });
    } else {
      setDate(new Date()); // 새 데이터 등록 시 현재 날짜 설정
      setBodyData({ weight: "", SMM: "", PBF: "" });
    }
  }, [editData]);

  // 숫자 입력만 허용
  const handleNumericInput = (value) => value.replace(/[^0-9.]/g, "");

  const onSave = async () => {
    const { weight, SMM, PBF } = bodyData;
    if (!weight || !SMM || !PBF) {
      Alert.alert("알림", "모든 항목을 입력해주세요.", [{ text: "확인" }]);
      return;
    }

    const data = {
      memberId,
      date,
      weight: parseFloat(weight).toFixed(1),
      SMM: parseFloat(SMM).toFixed(1),
      PBF: parseFloat(PBF).toFixed(1),
    };

    try {
      if (editData) {
        await updateBodyData(editData.id, data);
        Alert.alert("알림", "수정이 완료되었습니다.", [{ text: "확인" }]);

        // 수정하는 데이터가 최신 데이터일 경우 updateUser 호출
        if (latestData && editData.id === latestData.id) {
          await updateUser({ userId: memberId, updateField: { bodyData } });
        }
      } else {
        // 새로 등록하는 경우
        await createBodyData(data);
        Alert.alert("알림", "등록이 완료되었습니다.", [{ text: "확인" }]);
        await updateUser({ userId: memberId, updateField: { bodyData } });
      }

      setShow(false);
    } catch (error) {
      console.error("데이터 저장 중 오류 발생:", error);
      Alert.alert("오류", "데이터 저장 중 오류가 발생했습니다.", [
        { text: "확인" },
      ]);
    }
  };

  return (
    <Modal visible={show} transparent={true}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {editData ? "체성분 수정" : "체성분 등록"}
          </Text>
          {/* 날짜는 텍스트로만 표시하고 수정 불가 */}
          <View style={styles.dateContainer}>
            <Text style={styles.selectText}>{format(date, "yyyy-MM-dd")}</Text>
          </View>
          <View style={styles.inputContainer}>
            {["체중", "골격근량", "체지방률"].map((label, index) => (
              <View key={label} style={styles.bodyData}>
                <Text style={styles.label}>{label}:</Text>
                <TextInput
                  style={styles.input}
                  value={
                    bodyData[
                      index === 0 ? "weight" : index === 1 ? "SMM" : "PBF"
                    ]
                  }
                  onChangeText={(text) =>
                    setBodyData((prevState) => ({
                      ...prevState,
                      [index === 0 ? "weight" : index === 1 ? "SMM" : "PBF"]:
                        handleNumericInput(text),
                    }))
                  }
                  keyboardType="number-pad"
                />
                <Text style={styles.unit}>{index === 2 ? "(%)" : "(kg)"}</Text>
              </View>
            ))}
          </View>
          <View style={styles.modalButtons}>
            <Pressable
              onPress={onSave}
              style={[styles.modalButton, { backgroundColor: "#1f6feb" }]}
            >
              <Text style={{ color: "#fff" }}>
                {editData ? "수정" : "등록"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShow(false)}
              style={styles.modalButton}
            >
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
  dateContainer: {
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
