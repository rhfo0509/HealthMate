import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import {
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  format,
  subWeeks,
} from "date-fns";
import { ko } from "date-fns/locale";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { useUserContext } from "../contexts/UserContext";
import ExerciseChart from "../components/ExerciseChart";

const ExerciseStatScreen = () => {
  const { user } = useUserContext();
  const [weeklyVolume, setWeeklyVolume] = useState({
    월: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
    화: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
    수: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
    목: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
    금: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
    토: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
    일: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
  });
  const [lastWeekAverage, setLastWeekAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  const firestore = getFirestore();
  const routinesCollection = collection(firestore, "routines");

  // 이번 주 날짜 범위
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  const currentWeekNumber = Math.ceil(format(start, "d") / 7);

  useEffect(() => {
    const startLastWeek = startOfWeek(subWeeks(new Date(), 1), {
      weekStartsOn: 1,
    });
    const endLastWeek = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });

    const unsubscribe = onSnapshot(
      query(routinesCollection, where("userId", "==", user.id)),
      (snapshot) => {
        const volumeByDay = {
          월: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
          화: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
          수: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
          목: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
          금: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
          토: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
          일: { 등: 0, 어깨: 0, 팔: 0, 가슴: 0, 다리: 0, 코어: 0 },
        };

        let lastWeekTotalVolume = 0;
        let lastWeekCount = 0;

        snapshot.forEach((doc) => {
          const routine = doc.data();
          const createdAt = routine.createdAt?.toDate();

          if (isWithinInterval(createdAt, { start, end })) {
            const dayOfWeek = format(createdAt, "eee", { locale: ko });
            routine.exercises.forEach((exercise) => {
              const category = exercise.category;
              const totalVolume = exercise.sets.reduce(
                (sum, set) =>
                  sum + parseInt(set.weight || 0) * parseInt(set.reps || 0),
                0
              );
              if (
                volumeByDay[dayOfWeek] &&
                volumeByDay[dayOfWeek][category] !== undefined
              ) {
                volumeByDay[dayOfWeek][category] += totalVolume;
              }
            });
          }

          if (
            isWithinInterval(createdAt, {
              start: startLastWeek,
              end: endLastWeek,
            })
          ) {
            routine.exercises.forEach((exercise) => {
              const totalVolume = exercise.sets.reduce(
                (sum, set) =>
                  sum + parseInt(set.weight || 0) * parseInt(set.reps || 0),
                0
              );
              lastWeekTotalVolume += totalVolume;
            });
            lastWeekCount += 1;
          }
        });

        setWeeklyVolume(volumeByDay);
        setLastWeekAverage(
          lastWeekCount > 0 ? lastWeekTotalVolume / lastWeekCount : 0
        );
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1f6feb" />
        </View>
      </View>
    );
  }

  let weeklyCount = 0;
  const totalWeeklyVolume = Object.values(weeklyVolume).reduce((acc, day) => {
    const dayTotal = Object.values(day).reduce(
      (dayAcc, value) => dayAcc + value,
      0
    );
    if (dayTotal > 0) {
      weeklyCount += 1;
    }
    return acc + dayTotal;
  }, 0);

  const weeklyAverage = weeklyCount > 0 ? totalWeeklyVolume / weeklyCount : 0;
  const differencePercentage =
    lastWeekAverage > 0
      ? ((weeklyAverage - lastWeekAverage) / lastWeekAverage) * 100
      : 0;
  const differenceText = differencePercentage > 0 ? "증가" : "감소";

  return (
    <View style={styles.container}>
      <View style={styles.weekInfoContainer}>
        <Text style={styles.weekInfoText}>
          {format(start, "yyyy년 M월")} {currentWeekNumber}주차
        </Text>
        <Text style={styles.dateRangeText}>
          ({format(start, "yyyy-MM-dd")} ~ {format(end, "yyyy-MM-dd")})
        </Text>
      </View>
      <ExerciseChart
        weeklyVolume={weeklyVolume}
        lastWeekAverage={lastWeekAverage}
      />
      <View style={styles.summaryContainer}>
        <Text style={styles.averageText}>
          주간 평균 볼륨: {Math.round(weeklyAverage)} kg
        </Text>
        <Text style={styles.comparisonText}>
          지난 주 대비 {Math.abs(differencePercentage).toFixed(1)}%{" "}
          {differenceText}했어요
        </Text>
      </View>
    </View>
  );
};

export default ExerciseStatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  weekInfoContainer: {
    paddingTop: 24,
    alignItems: "center",
    borderRadius: 8,
  },
  weekInfoText: {
    fontSize: 20,
    fontWeight: "600",
  },
  dateRangeText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  summaryContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  averageText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f6feb",
  },
  comparisonText: {
    fontSize: 16,
    color: "gray",
    marginTop: 8,
  },
});
