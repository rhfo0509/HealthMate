import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { format } from "date-fns";

function BodyHistory({ bodyHistoryData }) {
  const renderItem = ({ item, index }) => {
    let weightDiff = 0;
    let SMMDiff = 0;
    let PBFDiff = 0;
    const previousItem = bodyHistoryData[index + 1];

    if (previousItem) {
      weightDiff = parseFloat(item.weight) - parseFloat(previousItem.weight);
      SMMDiff = parseFloat(item.SMM) - parseFloat(previousItem.SMM);
      PBFDiff = parseFloat(item.PBF) - parseFloat(previousItem.PBF);
    }

    return (
      <View style={styles.container}>
        <Text style={{ fontWeight: "bold" }}>
          {format(item.date.toDate(), "yyyy년 MM월 dd일")}
        </Text>
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
      data={bodyHistoryData}
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
  history: {
    alignItems: "center",
  },
  historyGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default BodyHistory;
