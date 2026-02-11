import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { colors } from "../styles/theme";

import { useUserContext } from "../contexts/UserContext";
import { getRoutines, removeRoutine } from "../lib/routines";

function MyRoutineScreen() {
  const { user } = useUserContext();
  const navigation = useNavigation();
  const [routines, setRoutines] = useState([]);

  // 사용자 루틴을 가져와 상태에 설정
  useEffect(() => {
    const fetchRoutines = async () => {
      const myRoutines = await getRoutines(user.id);
      setRoutines(myRoutines.filter((routine) => routine.routineName));
    };
    fetchRoutines();
  }, [user.id]);

  // 선택된 루틴 데이터를 RoutineScreen으로 전달하는 핸들러
  const handleRoutineSelect = (routine) => {
    navigation.navigate("Routine", {
      selectedRoutine: routine,
      isEditing: false,
    });
  };

  // 루틴 삭제 핸들러
  const handleRoutineDelete = async (routineId) => {
    try {
      await removeRoutine(routineId);
      setRoutines((prev) => prev.filter((routine) => routine.id !== routineId));
    } catch (error) {
      console.error("Error deleting routine:", error);
    }
  };

  // 루틴 삭제 확인 알림창
  const confirmDeleteRoutine = (routineId, routineName) => {
    Alert.alert("루틴 삭제", `"${routineName}" 루틴을 삭제하시겠습니까?`, [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => handleRoutineDelete(routineId),
      },
    ]);
  };

  // 루틴 항목 렌더링
  const renderRoutineItem = ({ item }) => {
    const formattedDate = item.createdAt
      ? format(new Date(item.createdAt.seconds * 1000), "yyyy년 MM월 dd일")
      : "";

    return (
      <View style={styles.routineItem}>
        <View style={styles.routineHeader}>
          <Pressable
            style={styles.routineContent}
            onPress={() => handleRoutineSelect(item)}
          >
            <Text style={styles.routineName}>{item.routineName}</Text>
            <Text style={styles.routineDate}>{formattedDate}</Text>
          </Pressable>
          <Pressable
            style={styles.deleteButton}
            onPress={() => confirmDeleteRoutine(item.id, item.routineName)}
          >
            <Text style={styles.deleteButtonText}>삭제</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={renderRoutineItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  listContent: {
    padding: 16,
  },
  routineItem: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  routineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routineContent: {
    flex: 1,
  },
  routineName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  routineDate: {
    fontSize: 14,
    color: colors.text.hint,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: colors.error,
    borderRadius: 4,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: colors.background,
    fontSize: 14,
  },
});

export default MyRoutineScreen;