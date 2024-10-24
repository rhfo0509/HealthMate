import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { getMembership, updateMembership } from "../lib/memberships";
import {
  createSchedulesWithMembership,
  removeSchedulesWithMember,
} from "../lib/schedules";
import { addDays, format, max } from "date-fns";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import ExtendCountModal from "../components/ExtendCountModal";
import ChangeScheduleModal from "../components/ChangeScheduleModal";

function MembershipScreen() {
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const route = useRoute();
  const { memberId } = route.params;
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
    const q = query(membershipsCollection, where("memberId", "==", memberId));
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
  }, [memberId]);

  useEffect(() => {
    getMembership(memberId).then(setMembership);
  }, [memberId]);

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
              getMembership(memberId)
                .then(setMembership)
                .then(() => removeSchedulesWithMember(memberId));
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
              getMembership(memberId)
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
            removeSchedulesWithMember(memberId)
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
                const updatedMembership = await getMembership(memberId);
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

    return sortedSchedules?.map((schedule, index) => {
      const [hour, minute] = schedule.startTime.split(":").map(Number);

      // 1시간 더한 종료 시간 계산
      const endHour = (hour + 1) % 24;
      const endTime = `${String(endHour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;

      return (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.itemText}>{schedule.day}요일</Text>
          <Text style={styles.itemValue}>
            {schedule.startTime} ~ {endTime}
          </Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <Text style={styles.sectionTitle}>회원권 정보</Text>
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>시작일자</Text>
            <Text style={styles.itemValue}>{membership?.startDate}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>종료일자</Text>
            <Text style={styles.itemValue}>{membership?.endDate}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>등록횟수</Text>
            <Text style={styles.itemValue}>{membership?.count}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>잔여횟수</Text>
            <Text style={styles.itemValue}>{membership?.remaining}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>등록요일 및 시간</Text>
          {showMembershipDays()}
        </View>
      </ScrollView>

      <View style={styles.fixedButtons}>
        {membership?.status !== "expired" && (
          <Pressable
            style={styles.button}
            android_ripple={{ color: "#ededed" }}
            onPress={
              membership?.status === "active" ? onPressPause : onPressResume
            }
          >
            <Text style={styles.buttonText}>
              {membership?.status === "active" ? "일시중지" : "재개하기"}
            </Text>
          </Pressable>
        )}
        {membership?.status !== "paused" && (
          <Pressable
            style={styles.button}
            android_ripple={{ color: "#ededed" }}
            onPress={onPressExtend}
          >
            <Text style={styles.buttonText}>횟수연장</Text>
          </Pressable>
        )}
        {membership?.status === "active" && (
          <Pressable
            style={styles.button}
            android_ripple={{ color: "#ededed" }}
            onPress={onPressChange}
          >
            <Text style={styles.buttonText}>요일/시간변경</Text>
          </Pressable>
        )}
      </View>

      <ExtendCountModal
        visible={showFirst}
        onClose={() => setShowFirst(false)}
        membership={membership}
        membershipCount={membershipCount}
        setMembershipCount={setMembershipCount}
        onSave={onSaveExtend}
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
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginHorizontal: 16,
  },
  itemText: {
    fontSize: 16,
    color: "#2D3748",
    fontWeight: "bold",
  },
  itemValue: {
    fontSize: 16,
    color: "#4A5568",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f6feb",
    marginVertical: 16,
    marginLeft: 16,
  },
  fixedButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
    marginHorizontal: 16,
    gap: 8,
  },
  button: {
    backgroundColor: "#1f6feb",
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "#fff",
  },
});

export default MembershipScreen;
