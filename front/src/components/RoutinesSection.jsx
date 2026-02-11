import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { isSameDay } from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";

import { colors } from "../styles/theme";
function RoutinesSection({
  routines,
  selectedDate,
  selectedRoutineId,
  setSelectedRoutineId,
  navigation,
}) {
  const todayRoutines = routines.filter((routine) =>
    isSameDay(routine.createdAt?.toDate(), selectedDate)
  );

  // 오늘의 운동 요약 정보 계산 함수
  const getExerciseSummary = () => {
    // 총 운동 수 계산
    const totalExercises = todayRoutines.reduce(
      (acc, routine) => acc + routine.exercises.length,
      0
    );
    // 총 세트 수 계산
    const totalSets = todayRoutines.reduce(
      (acc, routine) =>
        acc +
        routine.exercises.reduce(
          (setAcc, exercise) => setAcc + exercise.sets.length,
          0
        ),
      0
    );
    // 총 반복 횟수 계산
    const totalReps = todayRoutines.reduce(
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
    );
    // 총 운동량(세트의 무게 * 반복 횟수) 계산
    const totalVolume = todayRoutines.reduce(
      (acc, routine) =>
        acc +
        routine.exercises.reduce(
          (volAcc, exercise) =>
            volAcc +
            exercise.sets.reduce(
              (sum, set) =>
                sum + parseInt(set.weight || 0) * parseInt(set.reps || 0),
              0
            ),
          0
        ),
      0
    );

    return { totalExercises, totalSets, totalReps, totalVolume };
  };

  const { totalExercises, totalSets, totalReps, totalVolume } =
    getExerciseSummary();

  return (
    <View>
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>오늘의 운동</Text>
        {todayRoutines.length > 0 && (
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
            <MaterialIcons name="edit" size={24} color={colors.primary[500]} />
          </Pressable>
        )}
      </View>

      {todayRoutines.length > 0 ? (
        <>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>EXERCISES</Text>
              <Text style={styles.summaryValue}>{totalExercises}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>SETS</Text>
              <Text style={styles.summaryValue}>{totalSets}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>REPS</Text>
              <Text style={styles.summaryValue}>{totalReps}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>VOLUME</Text>
              <Text style={styles.summaryValue}>{totalVolume} kg</Text>
            </View>
          </View>

          <View style={styles.routinesContainer}>
            {todayRoutines.map((routine, index) => (
              <View key={routine.id} style={styles.routineItem}>
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
                {routine.exercises.map((exercise, idx) => (
                  <View key={idx} style={styles.exerciseRow}>
                    <Text style={[styles.exerciseName, styles.nutrient]}>
                      {exercise.name}
                    </Text>
                    <Text style={[styles.category, styles.nutrient]}>
                      {exercise.category}
                    </Text>
                    <Text style={[styles.setCount, styles.nutrient]}>
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
    </View>
  );
}

const styles = {
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
  editButton: {
    padding: 5,
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    backgroundColor: colors.surface,
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
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.primary,
  },
  routinesContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  routineItem: {
    marginBottom: 8,
    paddingBottom: 8,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxUnchecked: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.border.main,
    marginRight: 10,
    borderRadius: 4,
  },
  checkboxChecked: {
    width: 20,
    height: 20,
    backgroundColor: colors.primary[500],
    marginRight: 10,
    borderRadius: 4,
  },
  routineName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Cafe24SsurroundAir',
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  nutrient: {
    marginRight: 6,
    paddingHorizontal: 4,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.background,
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
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.secondary,
    textAlign: "center",
  },
};

export default RoutinesSection;
