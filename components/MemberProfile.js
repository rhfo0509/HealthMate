import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Avatar from "./Avatar";
import BodyHistoryChart from "./BodyHistoryChart";
import { format } from "date-fns";
import { createBodyHistory } from "../lib/bodyHistory";

function MemberProfile({ user }) {
  const [show, setShow] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(null);
  const [mode, setMode] = useState("weight");
  const [weight, setWeight] = useState("");
  const [SMM, setSMM] = useState(""); // 골격근량
  const [PBF, setPBF] = useState(""); // 체지방률

  const onPress = () => {
    setShow(true);
  };

  const onPressDatePicker = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate);
  };

  const onSave = () => {
    const bodyData = { weight, SMM, PBF };
    createBodyHistory({
      memberId: user.id,
      date: date ? date : new Date(),
      bodyData,
    });
    setDate(null);
    setWeight("");
    setSMM("");
    setPBF("");
    setShow(false);
  };

  const onClose = () => {
    setDate(null);
    setWeight("");
    setSMM("");
    setPBF("");
    setShow(false);
  };

  return (
    <View style={styles.block}>
      <View style={styles.userInfo}>
        <Avatar source={user.photoURL && { uri: user.photoURL }} size={128} />
        <Text style={styles.username}>
          {user.displayName} 회원님 환영합니다!
        </Text>
      </View>
      <View style={styles.chartInfo}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <Pressable
              style={styles.button}
              onPress={() => setMode("weight")}
              android_ripple={{ color: "white" }}
            >
              <Text>체중</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => setMode("SMM")}
              android_ripple={{ color: "white" }}
            >
              <Text>골격근량</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => setMode("PBF")}
              android_ripple={{ color: "white" }}
            >
              <Text>체지방률</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={onPress}
              android_ripple={{ color: "white" }}
            >
              <Text>
                <MaterialIcons name="add" size={24} color="black" />
              </Text>
            </Pressable>
          </View>
          <Modal
            visible={show}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View>
                  <Text style={{ fontSize: 16 }}>날짜를 선택해주세요.</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Pressable style={styles.select} onPress={onPressDatePicker}>
                    <Text style={styles.itemText}>
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
                </View>
                <View style={{ margin: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text>　　체중:</Text>
                    <TextInput
                      style={styles.input}
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="number-pad"
                    />
                    <Text>(kg)</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text>골격근량: </Text>
                    <TextInput
                      style={styles.input}
                      value={SMM}
                      onChangeText={setSMM}
                      keyboardType="number-pad"
                    />
                    <Text>(kg)</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text>체지방률: </Text>
                    <TextInput
                      style={styles.input}
                      value={PBF}
                      onChangeText={setPBF}
                      keyboardType="number-pad"
                    />
                    <Text>(%)</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                  }}
                >
                  <Pressable onPress={onSave} style={{ padding: 10 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: "#64B5F6",
                      }}
                    >
                      등록
                    </Text>
                  </Pressable>
                  <Pressable onPress={onClose} style={{ padding: 10 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: "#E57373",
                      }}
                    >
                      취소
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <BodyHistoryChart memberId={user.id} mode={mode} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: "white",
  },
  userInfo: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  username: {
    marginTop: 8,
    fontSize: 24,
    color: "#424242",
  },
  chartInfo: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#ededed",
    alignSelf: "center",
  },
  chartTitle: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  chartTitleText: {
    fontWeight: "500",
    fontSize: 24,
  },
  button: {
    padding: 20,
    backgroundColor: "#ededed",
    marginHorizontal: 10,
    borderRadius: 10,
  },
  input: {
    width: "50%",
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderRadius: 5,
  },
  select: {
    fontSize: 16,
    borderBottomWidth: 1,
    marginHorizontal: 4,
    marginBottom: 10,
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
    paddingTop: 30,
    paddingBottom: 50,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
});

export default MemberProfile;
