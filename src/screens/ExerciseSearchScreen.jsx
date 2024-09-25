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
import exerciseData from "../assets/exercise.json"; // JSON 파일에서 데이터 가져오기

function ExerciseSearchScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { relatedUserId } = route.params;

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = [
    "전체",
    "가슴",
    "등",
    "어깨",
    "삼두",
    "이두",
    "전완",
    "복근",
    "둔근",
    "햄스트링",
    "대퇴사두",
  ];

  useEffect(() => {
    const allExercises = Object.entries(exerciseData).flatMap(
      ([category, exercises]) =>
        exercises.map((exercise) => ({ name: exercise, category }))
    );

    // 카테고리에 따라 운동 목록을 필터링하고 검색어를 추가로 적용
    const filteredByCategory =
      selectedCategory === "전체"
        ? allExercises
        : allExercises.filter(
            (exercise) => exercise.category === selectedCategory
          );

    // 검색어에 따라 운동 목록을 필터링
    const finalFiltered = searchQuery.trim()
      ? filteredByCategory.filter((exercise) =>
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : filteredByCategory;

    setFilteredExercises(
      finalFiltered.sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [selectedCategory, searchQuery]);

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.exerciseItem}
      onPress={() =>
        navigation.navigate("AddRoutine", {
          relatedUserId,
          selectedExercise: item.name,
          selectedCategory: item.category, // 실제 카테고리 전달
        })
      }
    >
      <Text style={styles.exerciseText}>{item.name}</Text>
      <Text style={styles.categoryText}>{item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="운동 검색"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
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
    backgroundColor: "#fff",
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
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
    borderColor: "#ddd",
    backgroundColor: "#f0f0f0",
  },
  selectedCategoryButton: {
    backgroundColor: "royalblue",
    borderColor: "royalblue",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedCategoryButtonText: {
    color: "#fff",
  },
  exerciseList: {
    marginTop: 10,
  },
  exerciseItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  exerciseText: {
    fontSize: 16,
    color: "#333",
  },
  categoryText: {
    fontSize: 12,
    color: "#777",
  },
});

export default ExerciseSearchScreen;
