import React, { useState, useEffect } from "react";
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
import { getFoods } from "../lib/foods";
import { getUser, getRole } from "../lib/users";
import NutritionPieChart from "../components/NutritionPieChart";

function DashboardScreen() {
  const route = useRoute();
  const { relatedUserId } = route.params; // 회원의 ID
  const { user } = useUserContext();
  const firestore = getFirestore();
  const foodsCollection = collection(firestore, "foods");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [foods, setFoods] = useState([]);
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

  const [role, setRole] = useState(null); // 트레이너인지 회원인지 저장할 상태

  useEffect(() => {
    const fetchRole = async () => {
      try {
        // 현재 로그인한 사용자의 역할을 가져옴
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
      try {
        // 트레이너일 경우 relatedUserId로 회원 정보, 회원일 경우 자기 자신의 정보를 가져옴
        const userIdToFetch = role === "trainer" ? relatedUserId : user.id;
        const userInfo = await getUser(userIdToFetch); // 관련된 사용자 정보 가져오기
        const birthYear = new Date(userInfo.birthDate).getFullYear();
        const age = new Date().getFullYear() - birthYear;
        const weight = parseFloat(userInfo?.bodyData?.weight || 0);
        let BMR;

        if (userInfo.gender === "Male") {
          BMR = 88.362 + 13.397 * weight + 4.799 * 175 - 5.677 * age;
        } else {
          BMR = 447.593 + 9.247 * weight + 3.098 * 160 - 4.33 * age;
        }

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
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (role) {
      fetchMemberInfo();
    }
  }, [user.id, relatedUserId, role]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const fetchedFoods = await getFoods(
          user.id,
          role === "trainer" ? relatedUserId : user.id
        );
        setFoods(fetchedFoods);
      } catch (error) {
        console.error("Error fetching foods:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    if (role) {
      fetchFoods();
    }
  }, [user.id, relatedUserId, role]);

  useEffect(() => {
    const q = query(
      foodsCollection,
      where("userId", "in", [user.id, relatedUserId]),
      where("relatedUserId", "in", [user.id, relatedUserId])
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const foods = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFoods(foods);
    });
    return () => {
      unsubscribe();
    };
  }, [user.id, relatedUserId]);

  useEffect(() => {
    const calculateTotalsByDate = () => {
      const filtered = foods.filter((foodItem) =>
        isSameDay(foodItem.createdAt?.toDate(), selectedDate)
      );

      const totalValues = filtered.reduce(
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

    if (foods.length > 0) {
      calculateTotalsByDate();
    }
  }, [selectedDate, foods]);

  return (
    <View style={styles.block}>
      <CalendarHeader
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        markedDates={foods.map((food) => ({
          date: food.createdAt?.toDate(),
          dots: [{ color: "royalblue", selectedColor: "royalblue" }],
        }))}
      />

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="royalblue" />
        </View>
      ) : (
        <ScrollView>
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
  pieRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default DashboardScreen;
