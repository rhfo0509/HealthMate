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
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onPressClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View>
            <View>
              {Object.entries(membershipInfo.days).map(([day, data]) => (
                <View key={day} style={styles.inputGroup}>
                  <Text style={[styles.text, { top: -3 }]}>{day}</Text>
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
                  <View style={styles.input}>
                    <TextInput
                      editable={data.checked}
                      maxLength={2}
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
                      keyboardType="numeric"
                      returnKeyType="next"
                    />
                    <Text style={{ marginRight: 5 }}> : </Text>
                    <TextInput
                      editable={data.checked}
                      maxLength={2}
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
                      keyboardType="numeric"
                      returnKeyType="next"
                    />
                  </View>
                  <Text style={{ marginRight: 10 }}>~</Text>
                  <View style={styles.input}>
                    <TextInput
                      editable={data.checked}
                      maxLength={2}
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
                      keyboardType="numeric"
                      returnKeyType="next"
                    />
                    <Text style={{ marginRight: 5 }}> : </Text>
                    <TextInput
                      editable={data.checked}
                      maxLength={2}
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
                      keyboardType="numeric"
                      returnKeyType="done"
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.buttonGroup}>
            <Pressable onPress={onPressSave} style={{ padding: 10 }}>
              <Text style={[styles.text, { color: "#64B5F6" }]}>등록</Text>
            </Pressable>
            <Pressable onPress={onPressClose} style={{ padding: 10 }}>
              <Text style={[styles.text, { color: "#E57373" }]}>취소</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 24,
    width: 72,
    flexDirection: "row",
    alignItems: "center",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: -5,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  buttonGroup: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    right: 10,
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

export default MembershipModal;
