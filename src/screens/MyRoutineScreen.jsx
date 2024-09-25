// MyRoutineScreen.js
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
import { getRoutines, removeRoutines } from "../lib/routines";
import { useUserContext } from "../contexts/UserContext";
import { format } from "date-fns";

function MyRoutineScreen() {
  const { user } = useUserContext();
  const navigation = useNavigation();
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    const fetchRoutines = async () => {
      const myRoutines = await getRoutines(user.id);
      setRoutines(myRoutines.filter((routine) => routine.routineName));
    };
    fetchRoutines();
  }, [user.id]);

  const handleRoutineSelect = (routine) => {
    // 선택된 루틴 데이터를 AddRoutineScreen으로 전달
    navigation.navigate("AddRoutine", { selectedRoutine: routine });
  };

  const handleRoutineDelete = async (routineId) => {
    try {
      await removeRoutines(routineId);
      setRoutines((prev) => prev.filter((routine) => routine.id !== routineId));
    } catch (error) {
      console.error("Error deleting routine:", error);
    }
  };

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
    backgroundColor: "#f4f6f9",
  },
  listContent: {
    padding: 16,
  },
  routineItem: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
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
    color: "#333",
  },
  routineDate: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#ff4d4d",
    borderRadius: 4,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default MyRoutineScreen;
