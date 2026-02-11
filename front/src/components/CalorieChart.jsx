import React from "react";
import { BarChart } from "react-native-gifted-charts";
import { colors } from "../styles/theme";

function ExerciseChart({ weeklyCal, lastWeekAverageCal }) {
  const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

  const data = daysOfWeek.map((day) => ({
    value: weeklyCal[day],
    label: day,
    spacing: 36,
    labelTextStyle: { 
      color: "gray", 
      fontSize: 12,
      fontFamily: 'Cafe24SsurroundAir',
    },
    frontColor: colors.primary[400],
    gradientColor: colors.primary[300],
  }));

  return (
    <BarChart
      data={data}
      barWidth={12}
      barBorderRadius={4}
      isAnimated
      hideRules
      xAxisThickness={0}
      yAxisThickness={0}
      yAxisTextStyle={{ 
        color: "gray", 
        fontSize: 12,
        fontFamily: 'Cafe24SsurroundAir',
      }}
      noOfSections={3}
      maxValue={Math.max(
        1,
        Math.max(...Object.values(weeklyCal), lastWeekAverageCal)
      )}
      width={400}
      formatYLabel={(label) => {
        if (+label >= 1000000) return (label / 1000000).toFixed(1) + "M";
        if (+label >= 1000) return (label / 1000).toFixed(1) + "K";
        return label;
      }}
      showReferenceLine1
      referenceLine1Position={lastWeekAverageCal}
      referenceLine1Config={{
        color: "gray",
        dashWidth: 2,
        dashGap: 3,
      }}
    />
  );
}

export default ExerciseChart;
