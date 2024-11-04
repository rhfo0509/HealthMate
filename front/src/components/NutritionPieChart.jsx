import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const NutritionPieChart = ({ title, total, recommended, color }) => {
  const createPieData = (total, recommended, color) => {
    return [
      {
        value: parseFloat(total),
        color: color,
      },
      {
        value: +total > +recommended ? 0 : parseFloat(recommended - total),
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
        innerRadius={70}
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
