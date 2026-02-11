import React from "react";
import { View, TextInput, Pressable, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { colors } from "../styles/theme";
function FoodInput({ food, onChange, onRemove, onSearch }) {
  return (
    <View style={styles.foodCard}>
      <View style={styles.foodInputRow}>
        <TextInput
          placeholder="음식명"
          value={food.name}
          onChangeText={(value) => onChange("name", value)}
          style={styles.foodInput}
        />
        <Pressable onPress={onSearch} style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color={colors.primary[500]} />
        </Pressable>
        <Pressable onPress={onRemove} style={styles.removeButton}>
          <MaterialIcons
            name="remove-circle-outline"
            size={24}
            color={colors.error}
          />
        </Pressable>
      </View>
      <View style={styles.nutritionRow}>
        <View style={styles.nutritionInputWrapper}>
          <TextInput
            placeholder="칼로리"
            value={food.calories.toString()}
            onChangeText={(value) => onChange("calories", value)}
            keyboardType="numeric"
            style={styles.nutritionInput}
          />
          <Text style={styles.unitText}>kcal</Text>
        </View>
        <View style={styles.nutritionInputWrapper}>
          <TextInput
            placeholder="탄수화물"
            value={food.carbs.toString()}
            onChangeText={(value) => onChange("carbs", value)}
            keyboardType="numeric"
            style={styles.nutritionInput}
          />
          <Text style={styles.unitText}>g</Text>
        </View>
      </View>
      <View style={styles.nutritionRow}>
        <View style={styles.nutritionInputWrapper}>
          <TextInput
            placeholder="단백질"
            value={food.protein.toString()}
            onChangeText={(value) => onChange("protein", value)}
            keyboardType="numeric"
            style={styles.nutritionInput}
          />
          <Text style={styles.unitText}>g</Text>
        </View>
        <View style={styles.nutritionInputWrapper}>
          <TextInput
            placeholder="지방"
            value={food.fat.toString()}
            onChangeText={(value) => onChange("fat", value)}
            keyboardType="numeric"
            style={styles.nutritionInput}
          />
          <Text style={styles.unitText}>g</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  foodCard: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: colors.surface,
    shadowColor: colors.gray[900],
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  foodInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  foodInput: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border.dark,
  },
  searchButton: {
    marginLeft: 8,
  },
  removeButton: {
    marginLeft: 8,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  nutritionInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border.dark,
    paddingHorizontal: 8,
    marginHorizontal: 0,
  },
  nutritionInput: {
    flex: 1,
    paddingVertical: 4,
    textAlign: "left",
  },
  unitText: {
    color: colors.text.secondary,
    marginLeft: 4,
  },
});

export default FoodInput;
