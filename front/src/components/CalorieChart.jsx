import React from "react";
import { BarChart } from "react-native-gifted-charts";

function ExerciseChart({ weeklyCal, lastWeekAverageCal }) {
  const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

  const data = daysOfWeek.map((day) => ({
    value: weeklyCal[day],
    label: day,
    spacing: 36,
    labelTextStyle: { color: "gray", fontSize: 12 },
    frontColor: "#FFB3BA",
  }));

  return (
    <BarChart
      data={data}
      barWidth={12}
      hideRules
      xAxisThickness={0}
      yAxisThickness={0}
      yAxisTextStyle={{ color: "gray", fontSize: 12 }}
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
