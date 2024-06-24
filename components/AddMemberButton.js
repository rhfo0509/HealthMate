import React, { useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Modal,
  Text,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserContext } from "../contexts/UserContext";
import { addMemberToTrainer } from "../lib/users";
import BorderedInput from "./BorderedInput";
import { CheckBox } from "react-native-elements";

function AddMemberButton() {
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberPhoneNumber, setMemberPhoneNumber] = useState("");
  const [membershipInfo, setMembershipInfo] = useState({
    startYear: null,
    startMonth: null,
    startDay: null,
    count: 0,
    days: {
      월: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
      화: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
      수: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
      목: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
      금: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
      토: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
      일: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
    },
  });
  const { user: trainer } = useUserContext();

  const handleSave = () => {
    console.log(trainer.id, memberName, memberPhoneNumber);
    addMemberToTrainer(trainer.id, {
      name: memberName,
      phoneNumber: memberPhoneNumber,
      membershipInfo,
    });
    setMemberName("");
    setMemberPhoneNumber("");
    setMembershipInfo({
      startYear: null,
      startMonth: null,
      startDay: null,
      count: 0,
      days: {
        월: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        화: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        수: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        목: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        금: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        토: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        일: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
      },
    });
    setShowSecond(false);
  };

  const handleNext = () => {
    setShowFirst(false);
    setShowSecond(true);
  };

  const handleClose = () => {
    setMemberName("");
    setMemberPhoneNumber("");
    setMembershipInfo({
      startYear: null,
      startMonth: null,
      startDay: null,
      count: 0,
      days: {
        월: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        화: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        수: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        목: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        금: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        토: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        일: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
      },
    });
    setShowFirst(false);
    setShowSecond(false);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.circle} onPress={() => setShowFirst(true)}>
        <MaterialIcons name="person-add" size={24} color="white" />
      </Pressable>
      <Modal
        visible={showFirst}
        animationType="fade"
        transparent={true}
        onRequestClose={handleClose}
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
              <Text style={{ fontSize: 24 }}>회원 및 회원권 등록</Text>
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
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>시작일자</Text>
              <TextInput
                style={styles.input}
                placeholder="년"
                value={membershipInfo.startYear}
                onChangeText={(text) =>
                  setMembershipInfo((prevInfo) => ({
                    ...prevInfo,
                    startYear: text,
                  }))
                }
                keyboardType="numeric"
                maxLength={4}
              />
              <TextInput
                style={styles.input}
                placeholder="월"
                value={membershipInfo.startMonth}
                onChangeText={(text) =>
                  setMembershipInfo((prevInfo) => ({
                    ...prevInfo,
                    startMonth: text,
                  }))
                }
                keyboardType="numeric"
                maxLength={2}
              />
              <TextInput
                style={styles.input}
                placeholder="일"
                value={membershipInfo.startDay}
                onChangeText={(text) =>
                  setMembershipInfo((prevInfo) => ({
                    ...prevInfo,
                    startDay: text,
                  }))
                }
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>횟수</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={2}
                onChangeText={(text) => {
                  setMembershipInfo((prevInfo) => ({
                    ...prevInfo,
                    count: text,
                  }));
                }}
              />
              <Text>회</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                bottom: 10,
                right: 10,
              }}
            >
              <Pressable onPress={handleNext} style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>다음</Text>
              </Pressable>
              <Pressable onPress={handleClose} style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>취소</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showSecond}
        animationType="fade"
        transparent={true}
        onRequestClose={handleClose}
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
              <Pressable onPress={handleSave} style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>등록</Text>
              </Pressable>
              <Pressable onPress={handleClose} style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>취소</Text>
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
    backgroundColor: "royalblue",
    borderRadius: 27,
    height: 54,
    width: 54,
    alignItems: "center",
    justifyContent: "center",
  },
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

export default AddMemberButton;
