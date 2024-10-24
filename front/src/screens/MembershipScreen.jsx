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
import { addDays, format, max } from "date-fns";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { getMembership, updateMembership } from "../lib/memberships";
import {
  createSchedulesWithMembership,
  removeSchedules,
} from "../lib/schedules";
import ExtendCountModal from "../components/ExtendCountModal";
import ChangeScheduleModal from "../components/ChangeScheduleModal";

function MembershipScreen() {
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
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const firestore = getFirestore();
  const membershipsCollection = collection(firestore, "memberships");

  // 선택한 회원의 회원권 정보를 실시간으로 가져옴
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

  // 회원권 일시중지
  const onPressPause = () => {
    Alert.alert(
      null,
      "정말로 중단하시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "네",
          onPress: async () => {
            await updateMembership(membership.id, { status: "paused" });
            const updatedMembership = await getMembership(memberId);
            setMembership(updatedMembership);
            await removeSchedules(memberId); // 일정 삭제
          },
        },
      ],
      { cancelable: true }
    );
  };

  // 회원권 재개
  const onPressResume = () => {
    Alert.alert(
      null,
      "정말로 재개하시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "네",
          onPress: async () => {
            await updateMembership(membership.id, {
              status: "active",
              startDate: format(new Date(), "yyyy-MM-dd"), // 재개일을 현재 날짜로 설정
            });
            const updatedMembership = await getMembership(memberId);
            setMembership(updatedMembership);
            await createSchedulesWithMembership(updatedMembership); // 일정 생성
          },
        },
      ],
      { cancelable: true }
    );
  };

  // 회원권 연장
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
          onPress: async () => {
            try {
              // 회원권 정보 업데이트
              await updateMembership(membership.id, {
                status: "active",
                count: +membership.count + +membershipCount,
                remaining: +membership.remaining + +membershipCount,
              });

              // 새로운 스케줄 생성
              await createSchedulesWithMembership({
                ...membership,
                remaining: membershipCount,
                startDate: format(
                  max([addDays(new Date(membership.endDate), 1), new Date()]),
                  "yyyy-MM-dd"
                ),
              });

              setMembershipCount("");
              setShowFirst(false);

              Alert.alert("성공", "횟수 연장이 성공적으로 완료되었습니다.");
            } catch (error) {
              console.error("연장 중 오류 발생:", error);
              Alert.alert("오류", "연장 처리 중 문제가 발생했습니다.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // 회원권 요일/시간 변경
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
          onPress: async () => {
            try {
              setIsLoading(true);

              await removeSchedules(memberId); // 기존 일정 삭제
              const updatedSchedules = Object.entries(membershipDays)
                .filter(([_, data]) => data.checked)
                .map(([day, data]) => ({ day, startTime: data.startTime }));

              await updateMembership(membership.id, {
                schedules: updatedSchedules,
              }); // 새로운 일정 업데이트
              const updatedMembership = await getMembership(memberId);
              await createSchedulesWithMembership(updatedMembership);

              setMembership(updatedMembership);
              Alert.alert("성공", "요일/시간이 변경되었습니다.");
            } catch (error) {
              console.error("요일/시간 변경 중 오류 발생:", error);
            } finally {
              setIsLoading(false);
              setShowSecond(false);
            }
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

  // 등록요일 및 시간 출력
  const showMembershipDays = () => {
    const daysOrder = ["월", "화", "수", "목", "금", "토", "일"];
    const sortedSchedules = membership?.schedules?.sort(
      (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
    );

    return sortedSchedules?.map((schedule, index) => {
      const [hour, minute] = schedule.startTime.split(":").map(Number);
      const endHour = (hour + 1) % 24; // 1시간 뒤 종료 시간 계산
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
        isLoading={isLoading}
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
