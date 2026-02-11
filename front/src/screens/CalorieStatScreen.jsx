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
import { colors } from "../styles/theme";

import { useUserContext } from "../contexts/UserContext";
import CalorieChart from "../components/CalorieChart";

const CalorieStatScreen = () => {
  const { user } = useUserContext();
  const [weeklyCal, setWeeklyCal] = useState({
    월: 0,
    화: 0,
    수: 0,
    목: 0,
    금: 0,
    토: 0,
    일: 0,
  });
  const [lastWeekAverageCal, setLastWeekAverageCal] = useState(0);
  const [weeklyAverageCal, setWeeklyAverageCal] = useState(0);
  const [loading, setLoading] = useState(true);

  const firestore = getFirestore();
  const foodsCollection = collection(firestore, "foods");

  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  const currentWeekNumber = Math.ceil(format(start, "d") / 7);

  useEffect(() => {
    const startLastWeek = startOfWeek(subWeeks(new Date(), 1), {
      weekStartsOn: 1,
    });
    const endLastWeek = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });

    const unsubscribe = onSnapshot(
      query(foodsCollection, where("userId", "==", user.id)),
      (snapshot) => {
        const calByDay = { 월: 0, 화: 0, 수: 0, 목: 0, 금: 0, 토: 0, 일: 0 };
        let lastWeekTotalCal = 0;
        const lastWeekDates = new Set();
        let weeklyDaysWithData = 0;

        snapshot.forEach((doc) => {
          const foodData = doc.data();
          const createdAt = foodData.createdAt?.toDate();

          if (isWithinInterval(createdAt, { start, end })) {
            const dayOfWeek = format(createdAt, "eee", { locale: ko });
            foodData.foods.forEach((food) => {
              const cal = parseFloat(food.calories || "0");
              calByDay[dayOfWeek] += cal;
            });
          }

          if (
            isWithinInterval(createdAt, {
              start: startLastWeek,
              end: endLastWeek,
            })
          ) {
            const formattedDate = format(createdAt, "yyyy-MM-dd");
            if (!lastWeekDates.has(formattedDate)) {
              lastWeekDates.add(formattedDate);
            }
            lastWeekTotalCal += foodData.foods.reduce(
              (sum, food) => sum + parseFloat(food.calories || "0"),
              0
            );
          }
        });

        const totalWeeklyCal = Object.values(calByDay).reduce(
          (acc, cal) => acc + cal,
          0
        );

        weeklyDaysWithData = Object.values(calByDay).filter(
          (val) => val > 0
        ).length;
        const currentWeekAverage =
          weeklyDaysWithData > 0 ? totalWeeklyCal / weeklyDaysWithData : 0;

        setWeeklyCal(calByDay);
        setWeeklyAverageCal(currentWeekAverage);
        setLastWeekAverageCal(
          lastWeekDates.size > 0 ? lastWeekTotalCal / lastWeekDates.size : 0
        );
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user.id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      </View>
    );
  }

  const percentageChange =
    lastWeekAverageCal > 0
      ? (
          ((weeklyAverageCal - lastWeekAverageCal) / lastWeekAverageCal) *
          100
        ).toFixed(2)
      : 0;

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
      <View style={{ marginTop: 40 }} />
      <CalorieChart
        weeklyCal={weeklyCal}
        lastWeekAverageCal={lastWeekAverageCal}
      />
      <View style={styles.summeryContainer}>
        <Text style={styles.averageText}>
          주간 평균 칼로리: {Math.round(weeklyAverageCal)} kcal
        </Text>
        <Text style={styles.percentageText}>
          지난 주 대비 {Math.abs(percentageChange).toFixed(1)}%{" "}
          {percentageChange >= 0 ? "증가" : "감소"}했어요
        </Text>
      </View>
    </View>
  );
};

export default CalorieStatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
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
    color: colors.text.secondary,
    marginTop: 4,
  },
  summeryContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  averageText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary[500],
  },
  percentageText: {
    fontSize: 16,
    color: "gray",
    marginTop: 8,
  },
});