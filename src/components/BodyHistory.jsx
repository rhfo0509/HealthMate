import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { format } from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";
import { removeBodyData } from "../lib/bodyData";

function BodyHistory({ bodyData }) {
  const handleDelete = (id) => {
    Alert.alert(
      "알림",
      "해당 데이터를 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await removeBodyData(id);
            } catch (error) {
              console.error("데이터 삭제 중 오류 발생:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item, index }) => {
    let weightDiff = 0;
    let SMMDiff = 0;
    let PBFDiff = 0;
    const previousItem = bodyData[index + 1];

    if (previousItem) {
      weightDiff = parseFloat(item.weight) - parseFloat(previousItem.weight);
      SMMDiff = parseFloat(item.SMM) - parseFloat(previousItem.SMM);
      PBFDiff = parseFloat(item.PBF) - parseFloat(previousItem.PBF);
    }

    return (
      <View style={styles.container}>
        <View style={styles.historyHeader}>
          <Text style={{ fontWeight: "bold" }}>
            {format(item.date.toDate(), "yyyy년 MM월 dd일")}
          </Text>
          {/* 삭제 버튼 */}
          <Pressable
            onPress={() => handleDelete(item.id)}
            style={styles.deleteButton}
          >
            <MaterialIcons
              name="remove-circle-outline"
              size={20}
              color="crimson"
            />
          </Pressable>
        </View>
        <View style={styles.historyGroup}>
          <View style={styles.history}>
            <Text>체중</Text>
            <Text>{item.weight}kg</Text>
            <Text>
              {Math.abs(weightDiff.toFixed(1))}kg{" "}
              {weightDiff.toFixed(1) >= 0 ? "🔺" : "🔻"}
            </Text>
          </View>
          <View style={styles.history}>
            <Text>골격근량</Text>
            <Text>{item.SMM}kg</Text>
            <Text>
              {Math.abs(SMMDiff.toFixed(1))}kg{" "}
              {SMMDiff.toFixed(1) >= 0 ? "🔺" : "🔻"}
            </Text>
          </View>
          <View style={styles.history}>
            <Text>체지방률</Text>
            <Text>{item.PBF}%</Text>
            <Text>
              {Math.abs(PBFDiff.toFixed(1))}%{" "}
              {PBFDiff.toFixed(1) >= 0 ? "🔺" : "🔻"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      style={{ marginTop: 20 }}
      data={bodyData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={true}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#e0e0e0",
    height: 1,
    width: "100%",
  },
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  history: {
    alignItems: "center",
  },
  historyGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  deleteButton: {
    padding: 4,
  },
});

export default BodyHistory;
