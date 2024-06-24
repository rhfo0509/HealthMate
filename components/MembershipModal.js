import React from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Modal,
  Text,
  TextInput,
} from "react-native";
import { CheckBox } from "react-native-elements";

function MembershipModal({
  visible,
  onPressSave,
  onPressClose,
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
            <Text style={{ fontSize: 24 }}>회원 스케줄 입력</Text>
          </View>
          <View>
            <View>
              {Object.entries(membershipInfo.days).map(([day, data]) => (
                <View
                  key={day}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Text>{day}</Text>
                  <CheckBox
                    checked={data.checked}
                    onPress={() => {
                      setMembershipInfo((prevInfo) => ({
                        ...prevInfo,
                        days: {
                          ...prevInfo.days,
                          [day]: {
                            ...prevInfo.days[day],
                            checked: !data.checked,
                          },
                        },
                      }));
                    }}
                  />
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 2,
                      paddingHorizontal: 10,
                      marginRight: 10,
                      height: 24,
                      width: 72,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      keyboardType="numeric"
                      maxLength={2}
                      editable={data.checked}
                      onChangeText={(text) => {
                        setMembershipInfo((prevInfo) => ({
                          ...prevInfo,
                          days: {
                            ...prevInfo.days,
                            [day]: {
                              ...prevInfo.days[day],
                              startHours: text,
                            },
                          },
                        }));
                      }}
                    />
                    <Text style={{ marginRight: 5 }}> : </Text>
                    <TextInput
                      keyboardType="numeric"
                      maxLength={2}
                      editable={data.checked}
                      onChangeText={(text) => {
                        setMembershipInfo((prevInfo) => ({
                          ...prevInfo,
                          days: {
                            ...prevInfo.days,
                            [day]: {
                              ...prevInfo.days[day],
                              startMinutes: text,
                            },
                          },
                        }));
                      }}
                    />
                  </View>
                  <Text style={{ marginRight: 10 }}>~</Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 2,
                      paddingHorizontal: 10,
                      marginRight: 10,
                      height: 24,
                      width: 72,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      keyboardType="numeric"
                      maxLength={2}
                      editable={data.checked}
                      onChangeText={(text) => {
                        setMembershipInfo((prevInfo) => ({
                          ...prevInfo,
                          days: {
                            ...prevInfo.days,
                            [day]: {
                              ...prevInfo.days[day],
                              endHours: text,
                            },
                          },
                        }));
                      }}
                    />
                    <Text style={{ marginRight: 5 }}> : </Text>
                    <TextInput
                      keyboardType="numeric"
                      maxLength={2}
                      editable={data.checked}
                      onChangeText={(text) => {
                        setMembershipInfo((prevInfo) => ({
                          ...prevInfo,
                          days: {
                            ...prevInfo.days,
                            [day]: {
                              ...prevInfo.days[day],
                              endMinutes: text,
                            },
                          },
                        }));
                      }}
                    />
                  </View>
                </View>
              ))}
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
            <Pressable onPress={onPressSave} style={{ padding: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>등록</Text>
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

export default MembershipModal;
