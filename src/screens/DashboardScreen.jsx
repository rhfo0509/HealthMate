// DashboardScreen.js
import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import CalendarHeader from "../components/CalendarHeader";
import { useUserContext } from "../contexts/UserContext";
import { isSameDay } from "date-fns";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getUser, getRole } from "../lib/users";
import NutritionPieChart from "../components/NutritionPieChart";

function DashboardScreen() {
  const route = useRoute();
  const { relatedUserId } = route.params;
  const { user } = useUserContext();
  const firestore = getFirestore();
  const foodsCollection = collection(firestore, "foods");
  const routinesCollection = collection(firestore, "routines");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [foods, setFoods] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const userRole = await getRole(user.id);
        setRole(userRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchRole();
  }, [user.id]);

  useEffect(() => {
    const fetchMemberInfo = async () => {
      if (!role) return;
      try {
        const userIdToFetch = role === "trainer" ? relatedUserId : user.id;
        const userInfo = await getUser(userIdToFetch);
        calculateRecommendedIntake(userInfo);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberInfo();
  }, [role, user.id, relatedUserId]);

  const calculateRecommendedIntake = (userInfo) => {
    const birthYear = new Date(userInfo.birthDate).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    const weight = parseFloat(userInfo?.bodyData?.weight || 0);
    const BMR =
      userInfo.gender === "Male"
        ? 88.362 + 13.397 * weight + 4.799 * 175 - 5.677 * age
        : 447.593 + 9.247 * weight + 3.098 * 160 - 4.33 * age;

    const activityLevel = 1.55;
    const TDEE = BMR * activityLevel;
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

  useEffect(() => {
    // 음식 데이터 실시간 구독 설정
    const unsubscribeFoods = subscribeToCollection(foodsCollection, setFoods);

    // 운동 데이터 실시간 구독 설정
    const unsubscribeRoutines = onSnapshot(
      query(
        routinesCollection,
        where("userId", "in", [user.id, relatedUserId])
      ),
      (snapshot) => {
        const fetchedRoutines = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // selectedDate에 맞게 필터링하여 setRoutines에 설정
        const filteredRoutines = fetchedRoutines.filter((routine) =>
          isSameDay(routine.createdAt?.toDate(), selectedDate)
        );
        setRoutines(filteredRoutines);
      }
    );

    return () => {
      unsubscribeFoods();
      unsubscribeRoutines();
    };
  }, [user.id, relatedUserId, selectedDate]);

  const subscribeToCollection = (collectionRef, setData) => {
    const q = query(
      collectionRef,
      where("userId", "in", [user.id, relatedUserId])
    );
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(data);
    });
  };

  useEffect(() => {
    calculateTotalsByDate();
  }, [foods, selectedDate]);

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

  const getMarkedDates = () => {
    const foodDates = foods.map((food) =>
      food.createdAt?.toDate().toDateString()
    );
    const routineDates = routines.map((routine) =>
      routine.createdAt?.toDate().toDateString()
    );
    const uniqueDates = [...new Set([...foodDates, ...routineDates])];

    return uniqueDates.map((date) => {
      const isFoodDate = foodDates.includes(date);
      const isRoutineDate = routineDates.includes(date);
      const dots = [];

      if (isFoodDate)
        dots.push({ color: "royalblue", selectedColor: "royalblue" });
      if (isRoutineDate)
        dots.push({ color: "orange", selectedColor: "orange" });

      return { date: new Date(date), dots };
    });
  };

  const calculateRoutineSummary = (routines) => {
    const exerciseCount = routines.reduce(
      (acc, routine) => acc + routine.exercises.length,
      0
    );
    const totalSets = routines.reduce(
      (acc, routine) =>
        acc +
        routine.exercises.reduce((setAcc, ex) => setAcc + ex.sets.length, 0),
      0
    );
    const totalReps = routines.reduce(
      (acc, routine) =>
        acc +
        routine.exercises.reduce(
          (repAcc, ex) =>
            repAcc +
            ex.sets.reduce((sum, set) => sum + parseInt(set.reps || 0), 0),
          0
        ),
      0
    );
    const totalVolume = routines.reduce(
      (acc, routine) =>
        acc +
        routine.exercises.reduce(
          (volAcc, ex) =>
            volAcc +
            ex.sets.reduce(
              (sum, set) =>
                sum + parseInt(set.weight || 0) * parseInt(set.reps || 0),
              0
            ),
          0
        ),
      0
    );

    return { exerciseCount, totalSets, totalReps, totalVolume };
  };

  const routineSummary = useMemo(
    () => calculateRoutineSummary(routines),
    [routines]
  );

  return (
    <View style={styles.block}>
      <CalendarHeader
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        markedDates={getMarkedDates()}
      />

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="royalblue" />
        </View>
      ) : (
        <ScrollView>
          {/* 오늘의 영양성분 */}
          <Text style={styles.sectionTitle}>오늘의 영양성분</Text>
          {user?.bodyData ? (
            <View>
              <View style={styles.pieRow}>
                <NutritionPieChart
                  title="칼로리"
                  total={totals.totalCalories}
                  recommended={recommendedIntake.calories}
                  color="#FF6F61"
                />
                <NutritionPieChart
                  title="탄수화물"
                  total={totals.totalCarbs}
                  recommended={recommendedIntake.carbs}
                  color="#4A90E2"
                />
              </View>

              <View style={styles.pieRow}>
                <NutritionPieChart
                  title="단백질"
                  total={totals.totalProtein}
                  recommended={recommendedIntake.protein}
                  color="#7ED321"
                />
                <NutritionPieChart
                  title="지방"
                  total={totals.totalFat}
                  recommended={recommendedIntake.fat}
                  color="#F8E71C"
                />
              </View>
            </View>
          ) : (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                체성분을 등록한 후에 차트가 표시됩니다.
              </Text>
            </View>
          )}

          {/* 오늘의 운동 */}
          <Text style={styles.sectionTitle}>오늘의 운동</Text>
          {routines.length > 0 ? (
            <>
              <View style={styles.summaryContainer}>
                {["EXERCISES", "SETS", "REPS", "VOLUME"].map((label, index) => (
                  <View key={index} style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>{label}</Text>
                    <Text style={styles.summaryValue}>
                      {label === "EXERCISES"
                        ? routineSummary.exerciseCount
                        : label === "SETS"
                        ? routineSummary.totalSets
                        : label === "REPS"
                        ? routineSummary.totalReps
                        : `${routineSummary.totalVolume}kg`}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.routinesContainer}>
                {routines.map((routine) => (
                  <View key={routine.id} style={styles.routineItem}>
                    {routine.exercises.map((exercise, index) => (
                      <View key={index} style={styles.nutritionRow}>
                        <Text style={[styles.nutrient, styles.exerciseName]}>
                          {exercise.name}
                        </Text>
                        <Text style={[styles.nutrient, styles.category]}>
                          {exercise.category}
                        </Text>
                        <Text style={[styles.nutrient, styles.setCount]}>
                          {exercise.sets.length}세트
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>등록된 운동이 없습니다.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 16,
    color: "#333",
  },
  pieRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    backgroundColor: "#f4f6f9",
    borderRadius: 8,
    marginBottom: 12,
  },
  summaryItem: {
    width: "50%",
    padding: 8,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  routinesContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  routineItem: {
    marginBottom: 8,
    paddingBottom: 8,
  },
  nutritionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  nutrient: {
    marginRight: 6,
    paddingHorizontal: 4,
    borderRadius: 4,
    fontSize: 14,
    color: "#fff",
  },
  exerciseName: {
    backgroundColor: "#ffab91",
  },
  category: {
    backgroundColor: "#81d4fa",
  },
  setCount: {
    backgroundColor: "#aed581",
  },
  infoContainer: {
    padding: 20,
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default DashboardScreen;
