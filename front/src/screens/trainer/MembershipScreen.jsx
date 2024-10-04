import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, Text, Alert } from "react-native";
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
import ExtendCountModal from "../../components/ExtendCountModal";
import ChangeScheduleModal from "../../components/ChangeScheduleModal";

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
  }, [user.id, memberId]);

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
        {
          text: "아니오",
          style: "cancel",
        },
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
        {
          text: "아니오",
          style: "cancel",
        },
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
    const days = { ...membershipDays };
    membership.schedules?.forEach((schedule) => {
      days[schedule.day] = {
        checked: true,
        startTime: schedule.startTime,
      };
    });
    setMembershipDays(days);
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
        {membership?.status === "active" ? (
          <Pressable
            style={styles.button}
            android_ripple={{ color: "#ededed" }}
            onPress={onPressChange}
          >
            <Text>요일/시간변경</Text>
          </Pressable>
        ) : null}
      </View>

      <ExtendCountModal
        visible={showFirst}
        onClose={() => setShowFirst(false)}
        membership={membership}
        membershipCount={membershipCount}
        setMembershipCount={setMembershipCount}
        onSave={onSaveExtend} // Pass the onSaveExtend function as a prop
      />

      <ChangeScheduleModal
        visible={showSecond}
        onClose={onCloseChange}
        onSave={onSaveChange}
        membershipDays={membershipDays}
        setMembershipDays={setMembershipDays}
      />
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
});

export default MembershipScreen;
