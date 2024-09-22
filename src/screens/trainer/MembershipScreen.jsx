import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { useRoute } from "@react-navigation/native";
import { useUserContext } from "../../contexts/UserContext";
import { getMembership, updateMembership } from "../../lib/memberships";
import {
  createSchedulesWithMembership,
  removeSchedulesWithMember,
} from "../../lib/schedules";
import { addDays, format, max } from "date-fns";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

function MembershipScreen() {
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const route = useRoute();
  const { memberId } = route.params;
  const { user } = useUserContext();
  const [membership, setMembership] = useState({});
  const [membershipCount, setMembershipCount] = useState("");
  const [membershipDays, setMembershipDays] = useState({
    월: { checked: false, startTime: null },
    화: { checked: false, startTime: null },
    수: { checked: false, startTime: null },
    목: { checked: false, startTime: null },
    금: { checked: false, startTime: null },
    토: { checked: false, startTime: null },
    일: { checked: false, startTime: null },
  });
  const firestore = getFirestore();
  const membershipsCollection = collection(firestore, "memberships");

  // memberships 컬렉션에 변화 발생 시
  useEffect(() => {
    const q = query(
      membershipsCollection,
      where("trainerId", "==", user.id),
      where("memberId", "==", memberId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const membership = {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data(),
      };
      setMembership(membership);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getMembership(user.id, memberId).then(setMembership);
  }, [user.id, memberId]);

  const onPressPause = () => {
    Alert.alert(
      null,
      "정말로 중단하시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "네",
          onPress: () => {
            updateMembership(membership.id, { status: "paused" }).then(() => {
              getMembership(user.id, memberId)
                .then(setMembership)
                .then(() => removeSchedulesWithMember(user.id, memberId));
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onPressResume = () => {
    Alert.alert(
      null,
      "정말로 재개하시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "네",
          onPress: () => {
            updateMembership(membership.id, {
              status: "active",
              startDate: format(new Date(), "yyyy-MM-dd"),
            }).then(() => {
              getMembership(user.id, memberId)
                .then(setMembership)
                .then(() => createSchedulesWithMembership(membership));
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onPressExtend = () => {
    setShowFirst(true);
  };

  const onSaveExtend = () => {
    Alert.alert(
      null,
      "정말로 연장하시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "네",
          onPress: () => {
            updateMembership(membership.id, {
              status: "active",
              count: +membership.count + +membershipCount,
              remaining: +membership.remaining + +membershipCount,
            }).then(() => {
              createSchedulesWithMembership({
                ...membership,
                remaining: membershipCount,
                startDate: format(
                  max([addDays(new Date(membership.endDate), 1), new Date()]),
                  "yyyy-MM-dd"
                ),
              });
            });
            setMembershipCount("");
            setShowFirst(false);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onCloseExtend = () => {
    setMembershipCount("");
    setShowFirst(false);
  };

  const onPressChange = () => {
    const days = { ...membershipDays };
    membership.schedules.forEach((schedule) => {
      days[schedule.day] = {
        checked: true,
        startTime: schedule.startTime,
      };
    });
    setMembershipDays(days);
    setShowSecond(true);
  };

  const onSaveChange = () => {
    Alert.alert(
      null,
      "정말로 변경하시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "네",
          onPress: () => {
            removeSchedulesWithMember(user.id, memberId)
              .then(() => {
                const updatedSchedules = Object.entries(membershipDays)
                  .filter(([_, data]) => data.checked)
                  .map(([day, data]) => ({
                    day,
                    startTime: data.startTime,
                  }));
                updateMembership(membership.id, {
                  schedules: updatedSchedules,
                });
              })
              .then(async () => {
                const updatedMembership = await getMembership(
                  user.id,
                  memberId
                );
                createSchedulesWithMembership(updatedMembership).then(() =>
                  setMembership(updatedMembership)
                );
              });
            setShowSecond(false);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onCloseChange = () => {
    setShowSecond(false);
  };

  const showMembershipDays = () => {
    const daysOrder = ["월", "화", "수", "목", "금", "토", "일"];

    const sortedSchedules = membership?.schedules?.sort(
      (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
    );

    return sortedSchedules?.map((schedule, index) => (
      <Text key={index} style={styles.itemText}>
        {schedule.day} {schedule.startTime}
      </Text>
    ));
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
        {membership?.status !== "expired" ? (
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
        ) : null}
        {membership?.status !== "paused" ? (
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
              <View>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  연장할 횟수를 입력해주세요.
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={{ borderBottomWidth: 1, marginRight: 5 }}
                  value={membershipCount}
                  onChangeText={setMembershipCount}
                  keyboardType="number-pad"
                />
                <Text> 회</Text>
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
                <Pressable onPress={onCloseExtend} style={{ padding: 10 }}>
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
              <View>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  변경할 스케줄을 입력해주세요.
                </Text>
              </View>
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
                        value={data.startTime}
                        maxLength={5}
                        editable={data.checked}
                        onChangeText={(text) => {
                          setMembershipDays((prevInfo) => ({
                            ...prevInfo,
                            [day]: {
                              ...prevInfo[day],
                              startTime: text,
                            },
                          }));
                        }}
                      />
                    </View>
                  </View>
                ))}
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
                <Pressable onPress={onCloseChange} style={{ padding: 10 }}>
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
    paddingTop: 30,
    paddingBottom: 50,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
});

export default MembershipScreen;
