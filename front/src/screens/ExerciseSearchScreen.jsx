import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../styles/theme";

import exerciseData from "../assets/exercise.json";

function ExerciseSearchScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { relatedUserId } = route.params;

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", "등", "어깨", "팔", "가슴", "다리", "코어"];

  // 카테고리 및 검색어에 따른 운동 목록 필터링
  useEffect(() => {
    const allExercises = Object.entries(exerciseData).flatMap(
      ([category, exercises]) =>
        exercises.map((exercise) => ({ name: exercise, category }))
    );

    // 카테고리에 따른 운동 목록 필터링
    const filteredByCategory =
      selectedCategory === "전체"
        ? allExercises
        : allExercises.filter(
            (exercise) => exercise.category === selectedCategory
          );

    // 검색어에 따른 운동 목록 필터링
    const finalFiltered = searchQuery.trim()
      ? filteredByCategory.filter((exercise) =>
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : filteredByCategory;

    setFilteredExercises(
      finalFiltered.sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [selectedCategory, searchQuery]);

  // 개별 운동 항목 렌더링
  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.exerciseItem}
      onPress={() =>
        navigation.navigate("Routine", {
          relatedUserId,
          selectedExercise: item.name,
          selectedCategory: item.category,
          isEditing: false,
        })
      }
    >
      <Text style={styles.exerciseText}>{item.name}</Text>
      <Text style={styles.categoryText}>{item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 운동 검색 입력 필드 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="운동 검색"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {/* 운동 카테고리 필터 */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item &&
                    styles.selectedCategoryButtonText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>
      {/* 운동 목록 렌더링 */}
      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.exerciseList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border.main,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: 'Cafe24SsurroundAir',
    backgroundColor: colors.surface,
  },
  categoryContainer: {
    marginBottom: 10,
    flexDirection: "row",
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.main,
    backgroundColor: colors.gray[100],
  },
  selectedCategoryButton: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.primary,
  },
  selectedCategoryButtonText: {
    color: colors.background,
  },
  exerciseList: {
    marginTop: 10,
  },
  exerciseItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  exerciseText: {
    fontSize: 16,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.primary,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.secondary,
  },
});

export default ExerciseSearchScreen;