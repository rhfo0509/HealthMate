import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  Pressable,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
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
import { MaterialIcons } from "@expo/vector-icons";

function DashboardScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { relatedUserId } = route.params;
  const { user } = useUserContext();
  const firestore = getFirestore();
  const foodsCollection = collection(firestore, "foods");
  const routinesCollection = collection(firestore, "routines");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [foods, setFoods] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoutineId, setSelectedRoutineId] = useState(null); // 선택된 루틴 ID

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
    const fetchUserRole = async () => {
      try {
        const userRole = await getRole(user.id);
        setRole(userRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    fetchUserRole();
  }, [user.id]);

  useEffect(() => {
    if (!role) return;

    const fetchMemberInfo = async () => {
      const userIdToFetch = role === "trainer" ? relatedUserId : user.id;
      try {
        const userInfo = await getUser(userIdToFetch);
        calculateRecommendedIntake(userInfo);
      } catch (error) {
        console.error("Error fetching user info:", error);
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
    const unsubscribeFoods = subscribeToCollection(foodsCollection, setFoods);
    const unsubscribeRoutines = subscribeToCollection(
      routinesCollection,
      setRoutines
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
    setIsLoading(false);
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
    const allDates = [...foods, ...routines].map((item) =>
      item.createdAt?.toDate().toDateString()
    );

    const uniqueDates = [...new Set(allDates)];

    return uniqueDates.map((date) => {
      const dots = [
        foods.some(
          (food) => food.createdAt?.toDate().toDateString() === date
        ) && {
          color: "#1f6feb",
          selectedColor: "#1f6feb",
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

  const renderRoutinesContent = () => {
    const todayRoutines = routines.filter((routine) =>
      isSameDay(routine.createdAt?.toDate(), selectedDate)
    );

    return todayRoutines.length > 0 ? (
      <>
        <View style={styles.summaryContainer}>
          {["EXERCISES", "SETS", "REPS", "VOLUME"].map((label, index) => (
            <View key={index} style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{label}</Text>
              <Text style={styles.summaryValue}>
                {label === "EXERCISES"
                  ? todayRoutines.reduce(
                      (acc, routine) => acc + routine.exercises.length,
                      0
                    )
                  : label === "SETS"
                  ? todayRoutines.reduce(
                      (acc, routine) =>
                        acc +
                        routine.exercises.reduce(
                          (setAcc, exercise) => setAcc + exercise.sets.length,
                          0
                        ),
                      0
                    )
                  : label === "REPS"
                  ? todayRoutines.reduce(
                      (acc, routine) =>
                        acc +
                        routine.exercises.reduce(
                          (repAcc, exercise) =>
                            repAcc +
                            exercise.sets.reduce(
                              (sum, set) => sum + parseInt(set.reps || 0),
                              0
                            ),
                          0
                        ),
                      0
                    )
                  : `${todayRoutines.reduce(
                      (acc, routine) =>
                        acc +
                        routine.exercises.reduce(
                          (volAcc, exercise) =>
                            volAcc +
                            exercise.sets.reduce(
                              (sum, set) =>
                                sum +
                                parseInt(set.weight || 0) *
                                  parseInt(set.reps || 0),
                              0
                            ),
                          0
                        ),
                      0
                    )}kg`}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.routinesContainer}>
          {todayRoutines.map((routine, index) => (
            <View key={routine.id} style={styles.routineItem}>
              {/* 체크박스와 운동 루틴 타이틀 표시 */}
              <Pressable
                style={styles.checkbox}
                onPress={() =>
                  setSelectedRoutineId(
                    selectedRoutineId === routine.id ? null : routine.id
                  )
                }
              >
                <View
                  style={
                    selectedRoutineId === routine.id
                      ? styles.checkboxChecked
                      : styles.checkboxUnchecked
                  }
                />
                <Text style={styles.routineName}>루틴 {index + 1}</Text>
              </Pressable>

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
    );
  };

  const renderNutritionContent = () => {
    const todayFoods = foods.filter((food) =>
      isSameDay(food.createdAt?.toDate(), selectedDate)
    );

    return todayFoods.length > 0 ? (
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
    );
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
          <ActivityIndicator size="large" color="#1f6feb" />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>오늘의 영양성분</Text>
            {foods.filter((food) =>
              isSameDay(food.createdAt?.toDate(), selectedDate)
            ).length > 0 && (
              <Pressable
                onPress={() => console.log("Edit Nutrition")}
                style={styles.editButton}
              >
                <MaterialIcons name="edit" size={24} color="#1f6feb" />
              </Pressable>
            )}
          </View>
          {renderNutritionContent()}

          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>오늘의 운동</Text>
            {routines.filter((routine) =>
              isSameDay(routine.createdAt?.toDate(), selectedDate)
            ).length > 0 && (
              <Pressable
                onPress={() => {
                  if (!selectedRoutineId) {
                    Alert.alert("알림", "수정할 루틴을 선택해주세요.");
                    return;
                  }
                  navigation.navigate("Routine", {
                    selectedRoutine: routines.find(
                      (routine) => routine.id === selectedRoutineId
                    ),
                    isEditing: true,
                  });
                }}
                style={styles.editButton}
              >
                <MaterialIcons name="edit" size={24} color="#1f6feb" />
              </Pressable>
            )}
          </View>
          {renderRoutinesContent()}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    padding: 5,
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
  routineName: {
    fontSize: 16,
    fontWeight: "500",
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
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxUnchecked: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    borderRadius: 4,
  },
  checkboxChecked: {
    width: 20,
    height: 20,
    backgroundColor: "#1f6feb",
    marginRight: 10,
    borderRadius: 4,
  },
});

export default DashboardScreen;
