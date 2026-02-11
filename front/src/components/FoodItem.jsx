import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors } from "../styles/theme";
function FoodItem({ food }) {
  return (
    <View style={styles.foodItem}>
      <View style={styles.foodRow}>
        <Text style={styles.foodName}>{food.name}</Text>
      </View>
      <View style={styles.nutritionRow}>
        <Text style={[styles.nutrient, styles.calories]}>
          칼 {parseFloat(food.calories).toFixed(2)}
        </Text>
        <Text style={[styles.nutrient, styles.carbs]}>
          탄 {parseFloat(food.carbs).toFixed(2)}
        </Text>
        <Text style={[styles.nutrient, styles.protein]}>
          단 {parseFloat(food.protein).toFixed(2)}
        </Text>
        <Text style={[styles.nutrient, styles.fat]}>
          지 {parseFloat(food.fat).toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  foodItem: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.main,
    paddingBottom: 8,
  },
  foodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
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
    color: colors.background,
  },
  calories: {
    backgroundColor: "#ffab91",
  },
  carbs: {
    backgroundColor: "#81d4fa",
  },
  protein: {
    backgroundColor: "#aed581",
  },
  fat: {
    backgroundColor: "#ffcc80",
  },
});

export default FoodItem;
