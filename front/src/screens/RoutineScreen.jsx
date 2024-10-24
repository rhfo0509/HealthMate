import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useUserContext } from "../contexts/UserContext";
import { createRoutine, updateRoutine } from "../lib/routines";
import IconRightButton from "../components/IconRightButton";

function RoutineScreen() {
  const navigation = useNavigation();
  const {
    relatedUserId,
    selectedExercise,
    selectedCategory,
    selectedRoutine,
    isEditing,
  } = useRoute().params || {};
  const { user } = useUserContext();

  const [exercises, setExercises] = useState([]);
  const [isSaveToMyRoutine, setIsSaveToMyRoutine] = useState(false); // 루틴 저장 여부
  const [routineName, setRoutineName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // 기존 루틴 데이터가 있다면 상태에 미리 설정
    if (selectedRoutine) {
      setExercises(selectedRoutine.exercises);
      setRoutineName(selectedRoutine.routineName || "");
    }
  }, [selectedRoutine]);

  useEffect(() => {
    if (selectedExercise) {
      // 선택된 운동이 있을 경우, 중복되지 않으면 운동 목록에 추가
      const exists = exercises.some(
        (exercise) => exercise.name === selectedExercise
      );
      if (!exists) {
        // 운동 목록에 새로운 운동 추가
        setExercises((prev) => [
          ...prev,
          {
            name: selectedExercise,
            category: selectedCategory,
            sets: [{ weight: "", reps: "" }],
          },
        ]);
      }
    }
  }, [selectedExercise]);

  // 루틴 저장 또는 업데이트 처리 함수
  const onSubmit = useCallback(async () => {
    setIsUploading(true);

    const routineData = {
      userId: user.id,
      relatedUserId: relatedUserId
        ? relatedUserId
        : selectedRoutine.relatedUserId,
      exercises,
      routineName: isSaveToMyRoutine && routineName.trim() ? routineName : null,
    };

    try {
      if (isEditing) {
        // 루틴 수정
        await updateRoutine(selectedRoutine.id, routineData);
      } else {
        // 새로운 루틴 생성
        await createRoutine(routineData);
      }
      navigation.pop();
    } catch (error) {
      console.error("Error saving routine:", error);
    } finally {
      setIsUploading(false);
    }
  }, [
    createRoutine,
    navigation,
    user.id,
    relatedUserId,
    exercises,
    isSaveToMyRoutine,
    routineName,
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isUploading ? null : <IconRightButton onPress={onSubmit} name="send" />,
    });
  }, [navigation, onSubmit, isUploading]);

  // 세트 변경 핸들러
  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].sets[setIndex][field] = value;
      return updated;
    });
  };

  // 세트 추가 함수
  const addSet = (exerciseIndex) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].sets.push({ weight: "", reps: "" });
      return updated;
    });
  };

  // 마지막 세트 삭제 함수
  const removeLastSet = (exerciseIndex) => {
    setExercises((prev) => {
      const updated = [...prev];
      if (updated[exerciseIndex].sets.length > 1) {
        updated[exerciseIndex].sets.pop();
      }
      return updated;
    });
  };

  // 운동 항목 삭제 함수
  const removeExercise = (exerciseIndex) => {
    setExercises((prev) => prev.filter((_, i) => i !== exerciseIndex));
  };

  if (isUploading) {
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1f6feb" />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 운동 추가 및 루틴 불러오기 버튼 */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.searchButton}
          onPress={() =>
            navigation.navigate("ExerciseSearch", { relatedUserId })
          }
        >
          <Text style={styles.buttonText}>운동 추가</Text>
        </Pressable>
        <Pressable
          style={styles.loadRoutineButton}
          onPress={() => navigation.navigate("MyRoutine", { userId: user.id })}
        >
          <Text style={styles.buttonText}>루틴 불러오기</Text>
        </Pressable>
      </View>

      {/* 루틴 저장 옵션 */}
      <View style={styles.saveRoutineContainer}>
        <Pressable
          style={styles.checkbox}
          onPress={() => setIsSaveToMyRoutine(!isSaveToMyRoutine)}
        >
          <View
            style={
              isSaveToMyRoutine
                ? styles.checkboxChecked
                : styles.checkboxUnchecked
            }
          />
          <Text style={styles.saveRoutineText}>내 루틴에 저장하기</Text>
        </Pressable>
        {isSaveToMyRoutine && (
          <TextInput
            style={styles.routineNameInput}
            placeholder="루틴 이름 입력"
            value={routineName}
            onChangeText={setRoutineName}
            placeholderTextColor="#a3a3a3"
          />
        )}
      </View>

      {/* 선택된 운동 및 세트 정보 표시 */}
      {exercises.map((exercise, exerciseIndex) => (
        <View key={exerciseIndex} style={styles.exerciseContainer}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Pressable
              style={styles.removeExerciseButton}
              onPress={() => removeExercise(exerciseIndex)}
            >
              <Text style={styles.buttonText}>X</Text>
            </Pressable>
          </View>

          {/* 세트 입력 필드 */}
          {exercise.sets.map((set, setIndex) => (
            <View key={setIndex} style={styles.setContainer}>
              <Text style={styles.setLabel}>세트 {setIndex + 1}</Text>
              <TextInput
                style={styles.input}
                placeholder="무게"
                keyboardType="numeric"
                value={set.weight}
                onChangeText={(value) =>
                  handleSetChange(exerciseIndex, setIndex, "weight", value)
                }
                placeholderTextColor="#a3a3a3"
              />
              <Text style={styles.unitText}>kg</Text>
              <TextInput
                style={styles.input}
                placeholder="횟수"
                keyboardType="numeric"
                value={set.reps}
                onChangeText={(value) =>
                  handleSetChange(exerciseIndex, setIndex, "reps", value)
                }
                placeholderTextColor="#a3a3a3"
              />
              <Text style={styles.unitText}>회</Text>
            </View>
          ))}

          {/* 세트 추가/삭제 버튼 */}
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.addButton}
              onPress={() => addSet(exerciseIndex)}
            >
              <Text style={styles.buttonText}>세트 추가</Text>
            </Pressable>
            <Pressable
              style={styles.removeSetButton}
              onPress={() => removeLastSet(exerciseIndex)}
              disabled={exercise.sets.length === 1}
            >
              <Text style={{ color: "#1f6feb" }}>세트 삭제</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#1f6feb",
    padding: 12,
    alignItems: "center",
    borderRadius: 4,
    flex: 1,
    marginRight: 5,
  },
  loadRoutineButton: {
    backgroundColor: "#1f6feb",
    padding: 12,
    alignItems: "center",
    borderRadius: 4,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  saveRoutineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
  saveRoutineText: {
    color: "#333",
    marginBottom: 3,
  },
  routineNameInput: {
    flex: 1,
    height: 40,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginLeft: 10,
    backgroundColor: "#f9f9f9",
  },
  exerciseContainer: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginBottom: 20,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f6feb",
  },
  removeExerciseButton: {
    backgroundColor: "#1f6feb",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  setContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  setLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
    color: "#333",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 5,
    backgroundColor: "#f9f9f9",
  },
  unitText: {
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#1f6feb",
    padding: 8,
    alignItems: "center",
    borderRadius: 4,
    flex: 1,
  },
  removeSetButton: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
    borderColor: "#1f6feb",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default RoutineScreen;
