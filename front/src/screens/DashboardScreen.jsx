import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { isSameDay } from "date-fns";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { useUserContext } from "../contexts/UserContext";
import { getUser, getRole } from "../lib/users";
import CalendarHeader from "../components/CalendarHeader";
import RoutinesSection from "../components/RoutinesSection";
import NutritionSection from "../components/NutritionSection";
import { colors } from "../styles/theme";

function DashboardScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { relatedUserId } = route.params;
  const { user } = useUserContext();

  const [role, setRole] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [foods, setFoods] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoutineId, setSelectedRoutineId] = useState(null);
  const [totals, setTotals] = useState({
    totalCalories: 0,
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0,
  });
  const [recommendedIntake, setRecommendedIntake] = useState({
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
  });

  const firestore = getFirestore();
  const foodsCollection = collection(firestore, "foods");
  const routinesCollection = collection(firestore, "routines");

  useEffect(() => {
    (async () => {
      const userRole = await getRole(user.id);
      setRole(userRole);
    })();
  }, [user.id]);

  useEffect(() => {
    if (!role) return;
    const userIdToFetch = role === "trainer" ? relatedUserId : user.id;
    (async () => {
      const userInfo = await getUser(userIdToFetch);
      calculateRecommendedIntake(userInfo);
    })();
  }, [role, user.id, relatedUserId]);

  useEffect(() => {
    const unsubscribeFoods = subscribeToCollection(foodsCollection, setFoods);
    const unsubscribeRoutines = subscribeToCollection(
      routinesCollection,
      setRoutines
    );

    return () => {
      unsubscribeFoods();
      unsubscribeRoutines();
    };
  }, [user.id, relatedUserId]);

  useEffect(() => {
    calculateTotalsByDate();
    setIsLoading(false);
  }, [foods, selectedDate]);

  const subscribeToCollection = (collectionRef, setData) => {
    const q = query(
      collectionRef,
      where("userId", "in", [user.id, relatedUserId])
    );
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(data);
    });
  };

  // 권장 섭취량 계산 함수
  const calculateRecommendedIntake = (userInfo) => {
    const birthYear = new Date(userInfo.birthDate).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    const weight = parseFloat(userInfo?.bodyData?.weight || 0);

    // 기초 대사량 계산 공식
    const BMR =
      userInfo.gender === "Male"
        ? 88.362 + 13.397 * weight + 4.799 * 175 - 5.677 * age
        : 447.593 + 9.247 * weight + 3.098 * 160 - 4.33 * age;

    // 활동 수준 (보통의 활동 수준으로 고정)
    const activityLevel = 1.55;
    // 총 일일 에너지 소비량
    const TDEE = BMR * activityLevel;
    // 권장 탄,단,지 섭취량
    const recommendedProtein = weight * 1.5;
    const recommendedFat = (TDEE * 0.25) / 9;
    const recommendedCarbs =
      (TDEE - (recommendedProtein * 4 + recommendedFat * 9)) / 4;

    setRecommendedIntake({
      calories: TDEE.toFixed(2),
      carbs: recommendedCarbs.toFixed(2),
      protein: recommendedProtein.toFixed(2),
      fat: recommendedFat.toFixed(2),
    });
  };

  // 선택된 날짜에 따른 총 영양성분 계산 함수
  const calculateTotalsByDate = () => {
    const filteredFoods = foods.filter((food) =>
      isSameDay(food.createdAt?.toDate(), selectedDate)
    );

    const totalValues = filteredFoods.reduce(
      (acc, foodItem) => {
        foodItem.foods.forEach((food) => {
          acc.totalCalories += parseFloat(food.calories || 0);
          acc.totalCarbs += parseFloat(food.carbs || 0);
          acc.totalProtein += parseFloat(food.protein || 0);
          acc.totalFat += parseFloat(food.fat || 0);
        });
        return acc;
      },
      { totalCalories: 0, totalCarbs: 0, totalProtein: 0, totalFat: 0 }
    );

    setTotals({
      totalCalories: totalValues.totalCalories.toFixed(2),
      totalCarbs: totalValues.totalCarbs.toFixed(2),
      totalProtein: totalValues.totalProtein.toFixed(2),
      totalFat: totalValues.totalFat.toFixed(2),
    });
  };

  // 선택된 날짜를 기준으로 표시할 마크된 날짜 계산
  const getMarkedDates = () => {
    const allDates = [...foods, ...routines].map((item) =>
      item.createdAt?.toDate().toDateString()
    );

    const uniqueDates = [...new Set(allDates)];

    return uniqueDates.map((date) => {
      const dots = [
        foods.some(
          (food) => food.createdAt?.toDate().toDateString() === date
        ) && {
          color: colors.primary[500],
          selectedColor: colors.primary[500],
        },
        routines.some(
          (routine) => routine.createdAt?.toDate().toDateString() === date
        ) && {
          color: "orange",
          selectedColor: "orange",
        },
      ].filter(Boolean);

      return { date: new Date(date), dots };
    });
  };

  return (
    <View style={styles.container}>
      <CalendarHeader
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        markedDates={getMarkedDates()}
      />

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <ScrollView>
          <NutritionSection
            foods={foods}
            selectedDate={selectedDate}
            totals={totals}
            recommendedIntake={recommendedIntake}
          />
          <RoutinesSection
            routines={routines}
            selectedDate={selectedDate}
            selectedRoutineId={selectedRoutineId}
            setSelectedRoutineId={setSelectedRoutineId}
            navigation={navigation}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DashboardScreen;
