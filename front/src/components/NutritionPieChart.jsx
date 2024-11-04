import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const NutritionPieChart = ({ title, total, recommended, color }) => {
  const createPieData = (total, recommended, color) => {
    // total이 recommended를 초과할 경우 recommended와 동일하게 표시
    const displayTotal = total > recommended ? recommended : total;

    return [
      {
        value: parseFloat(displayTotal),
        color: color,
      },
      {
        value: parseFloat(recommended - displayTotal),
        color: "#e0e0e0", // 남은 섭취량은 회색으로
      },
    ];
  };

  // 퍼센트 계산
  const percentage = Math.round((total / recommended) * 100);

  return (
    <View style={styles.pieContainer}>
      <Text style={styles.pieTitle}>{title}</Text>
      <PieChart
        data={createPieData(total, recommended, color)}
        radius={80}
        innerRadius={60}
        centerLabelComponent={() => (
          <View style={styles.centerLabelWrapper}>
            <Text style={styles.centerLabel}>
              {Math.round(total)} / {Math.round(recommended)}
            </Text>
            <Text style={styles.percentageLabel}>{percentage}%</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pieContainer: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  pieTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  centerLabelWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  percentageLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});

export default NutritionPieChart;
