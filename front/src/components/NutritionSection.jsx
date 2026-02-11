import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { isSameDay } from "date-fns";
import NutritionPieChart from "./NutritionPieChart";

import { colors } from "../styles/theme";
function NutritionSection({ foods, selectedDate, totals, recommendedIntake }) {
  const todayFoods = foods.filter((food) =>
    isSameDay(food.createdAt?.toDate(), selectedDate)
  );

  return (
    <View>
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>오늘의 영양성분</Text>
      </View>
      {todayFoods.length > 0 ? (
        <>
          <View style={styles.pieRow}>
            <NutritionPieChart
              title="칼로리"
              total={totals.totalCalories}
              recommended={recommendedIntake.calories}
              color={colors.error}
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
        </>
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            음식의 영양성분을 등록한 후에 차트가 표시됩니다.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.primary,
  },
  pieRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoContainer: {
    padding: 20,
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.secondary,
    textAlign: "center",
  },
});

export default NutritionSection;
