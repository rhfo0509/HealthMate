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
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
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
    marginBottom: 8,
  },
  foodInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: colors.border.dark,
    fontFamily: 'Cafe24SsurroundAir',
  },
  searchButton: {
    marginLeft: 12,
  },
  removeButton: {
    marginLeft: 12,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 12,
  },
  nutritionInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderColor: colors.border.dark,
  },
  nutritionInput: {
    flex: 1,
    paddingVertical: 8,
    textAlign: "left",
    fontFamily: 'Cafe24SsurroundAir',
  },
  unitText: {
    color: colors.text.secondary,
    marginLeft: 4,
    fontFamily: 'Cafe24SsurroundAir',
    fontSize: 14,
  },
});

export default FoodInput;
