import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";
import IconRightButton from "../components/IconRightButton";
import { getMembership, updateMembership } from "../lib/memberships";
import {
  createSchedulesWithMembership,
  removeSchedulesWithMember,
} from "../lib/schedules";
import { addDays, format } from "date-fns";
import BorderedInput from "../components/BorderedInput";

function MembershipScreen() {
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUserContext();
  const [membership, setMembership] = useState({});
  const [membershipCount, setMembershipCount] = useState(0);
  const [membershipDays, setMembershipDays] = useState({
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
  });

  const { memberId } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="check" />,
    });
  }, [navigation, onSubmit]);

  useEffect(() => {
    getMembership(user.id, memberId).then(setMembership);
  }, [user.id, memberId]);

  const onSubmit = () => {
    console.log("회원권 변경");
  };

  const onPressPause = () => {
    // 회원권에 status라는 속성을 두어
    // 활성화 상태: active, 중단된 상태: paused, 만료된 상태: expired로 설정
    console.log("일시중지");
    updateMembership(membership.id, { status: "paused" }).then(() => {
      getMembership(user.id, memberId)
        .then(setMembership)
        .then(() => removeSchedulesWithMember(user.id, memberId));
    });
  };

  const onPressResume = () => {
    console.log("재개하기");
    updateMembership(membership.id, {
      status: "active",
      startDate: format(new Date(), "yyyy-MM-dd"),
    }).then(() => {
      getMembership(user.id, memberId)
        .then(setMembership)
        .then(() => createSchedulesWithMembership(membership));
    });
  };

  const onPressExtend = () => {
    // 현재 잔여횟수를 보여주고 연장할 횟수를 입력하도록 모달을 보여줌
    setShowFirst(true);
  };

  const onSaveExtend = () => {
    updateMembership(membership.id, {
      count: +membership.count + +membershipCount,
      remaining: +membership.remaining + +membershipCount,
    }).then(() => {
      // TODO: createSchedulesWithMembership를 써야 하는데... startDate가 기준이 아닌 endDate가 기준이 되야 함
      createSchedulesWithMembership({
        ...membership,
        count: membershipCount,
        startDate: format(
          addDays(new Date(membership.endDate), 1),
          "yyyy-MM-dd"
        ),
      });
    });
    setMembershipCount(0);
    setShowFirst(false);
  };

  const onCloseExtend = () => {
    setMembershipCount(0);
    setShowFirst(false);
  };

  const onPressChange = () => {
    // 현재 요일/시간 체크 및 설정 상황을 보여주고 직접 입력하도록 모달을 보여줌
    const days = { ...membershipDays };
    Object.keys(membership.days).forEach((day) => {
      days[day] = {
        checked: true,
        startHours: membership.days[day].startTime.split(":")[0],
        startMinutes: membership.days[day].startTime.split(":")[1],
        endHours: membership.days[day].endTime.split(":")[0],
        endMinutes: membership.days[day].endTime.split(":")[1],
      };
    });
    setMembershipDays(days);
    setShowSecond(true);
  };

  const onSaveChange = () => {
    removeSchedulesWithMember(user.id, memberId)
      .then(() => {
        const formatDays = {};
        Object.entries(membershipDays).forEach(([day, data]) => {
          if (data.checked) {
            formatDays[day] = {
              startTime: `${data.startHours}:${data.startMinutes}`,
              endTime: `${data.endHours}:${data.endMinutes}`,
            };
          }
        });
        updateMembership(membership.id, { days: formatDays });
      })
      .then(() => {
        getMembership(user.id, memberId)
          .then(setMembership)
          .then(() => createSchedulesWithMembership(membership));
      });
    setShowSecond(false);
  };

  const onCloseChange = () => {
    const days = { ...membershipDays };
    Object.keys(membership.days).forEach((day) => {
      days[day] = {
        checked: true,
        startHours: membership.days[day].startTime.split(":")[0],
        startMinutes: membership.days[day].startTime.split(":")[1],
        endHours: membership.days[day].endTime.split(":")[0],
        endMinutes: membership.days[day].endTime.split(":")[1],
      };
    });
    setMembershipDays(days);
    setShowSecond(false);
  };

  const showMembershipDays = () => {
    const daysOrder = ["월", "화", "수", "목", "금", "토", "일"];

    // membership.days 객체의 키를 배열로 추출
    const daysKeys = Object.keys(membership?.days || {});

    // daysKeys를 daysOrder의 순서대로 정렬
    const sortedDaysKeys = daysKeys.sort((a, b) => {
      return daysOrder.indexOf(a) - daysOrder.indexOf(b);
    });

    // 정렬된 키를 사용하여 요일 및 시간 출력
    return sortedDaysKeys.map((key) => {
      const value = membership?.days[key];
      return (
        <Text key={key} style={styles.itemText}>
          {key} {value.startTime} : {value.endTime}
        </Text>
      );
    });
  };

  return (
    <View style={styles.block}>
      <View style={styles.item}>
        <Text style={styles.itemText}>시작일자: {membership?.startDate}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.itemText}>종료일자: {membership?.endDate}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.itemText}>등록횟수: {membership?.count}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.itemText}>잔여횟수: {membership?.remaining}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.itemText}>등록요일 및 시간</Text>
        {showMembershipDays()}
      </View>
      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          android_ripple={{ color: "#ededed" }}
          onPress={
            membership?.status === "active" ? onPressPause : onPressResume
          }
        >
          <Text>
            {membership?.status === "active" ? "일시중지" : "재개하기"}
          </Text>
        </Pressable>
        {membership?.status === "active" ? (
          <Pressable
            style={styles.button}
            android_ripple={{ color: "#ededed" }}
            onPress={onPressExtend}
          >
            <Text>횟수연장</Text>
          </Pressable>
        ) : null}
        <Modal
          visible={showFirst}
          animationType="fade"
          transparent={true}
          onRequestClose={onCloseExtend}
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
                <Text style={{ fontSize: 24 }}>횟수연장</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <BorderedInput
                  placeholder="연장할 횟수를 입력하세요."
                  value={membershipCount}
                  onChangeText={setMembershipCount}
                  keyboardType="number-pad"
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                }}
              >
                <Pressable onPress={onSaveExtend} style={{ padding: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>등록</Text>
                </Pressable>
                <Pressable onPress={onCloseExtend} style={{ padding: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>취소</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        {membership?.status === "active" ? (
          <Pressable
            style={styles.button}
            android_ripple={{ color: "#ededed" }}
            onPress={onPressChange}
          >
            <Text>요일/시간변경</Text>
          </Pressable>
        ) : null}
        <Modal
          visible={showSecond}
          animationType="fade"
          transparent={true}
          onRequestClose={onCloseChange}
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
                  {Object.entries(membershipDays).map(([day, data]) => (
                    <View
                      key={day}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text>{day}</Text>
                      <CheckBox
                        checked={data.checked}
                        onPress={() => {
                          setMembershipDays((prevInfo) => ({
                            ...prevInfo,
                            [day]: {
                              ...prevInfo[day],
                              checked: !data.checked,
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
                          value={data.startHours}
                          maxLength={2}
                          editable={data.checked}
                          onChangeText={(text) => {
                            setMembershipDays((prevInfo) => ({
                              ...prevInfo,
                              [day]: {
                                ...prevInfo[day],
                                startHours: text,
                              },
                            }));
                          }}
                        />
                        <Text style={{ marginRight: 5 }}> : </Text>
                        <TextInput
                          keyboardType="numeric"
                          value={data.startMinutes}
                          maxLength={2}
                          editable={data.checked}
                          onChangeText={(text) => {
                            setMembershipDays((prevInfo) => ({
                              ...prevInfo,
                              [day]: {
                                ...prevInfo[day],
                                startMinutes: text,
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
                          value={data.endHours}
                          maxLength={2}
                          editable={data.checked}
                          onChangeText={(text) => {
                            setMembershipDays((prevInfo) => ({
                              ...prevInfo,
                              [day]: {
                                ...prevInfo[day],
                                endHours: text,
                              },
                            }));
                          }}
                        />
                        <Text style={{ marginRight: 5 }}> : </Text>
                        <TextInput
                          keyboardType="numeric"
                          value={data.endMinutes}
                          maxLength={2}
                          editable={data.checked}
                          onChangeText={(text) => {
                            setMembershipDays((prevInfo) => ({
                              ...prevInfo,
                              [day]: {
                                ...prevInfo[day],
                                endMinutes: text,
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
                <Pressable onPress={onSaveChange} style={{ padding: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>등록</Text>
                </Pressable>
                <Pressable onPress={onCloseChange} style={{ padding: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>취소</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    paddingTop: 32,
  },
  item: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eeeeee",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    marginVertical: 8,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "flex",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 24,
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

export default MembershipScreen;
