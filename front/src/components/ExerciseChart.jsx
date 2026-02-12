import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

function ExerciseChart({ weeklyVolume, lastWeekAverage }) {
  const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];
  const categories = ["등", "어깨", "팔", "가슴", "다리", "코어"];
  const colors = [
    "#FF6B9D",  // 핑크 (등)
    "#FFA726",  // 오렌지 (어깨)
    "#FFD93D",  // 노랑 (팔)
    "#6BCF7F",  // 초록 (가슴)
    "#4FC3F7",  // 하늘색 (다리)
    "#BA68C8",  // 보라 (코어)
  ];

  const stackData = daysOfWeek.map((day) => ({
    stacks: categories.map((category, index) => ({
      value: isNaN(weeklyVolume[day]?.[category])
        ? 0
        : weeklyVolume[day][category],
      color: colors[index % colors.length],
      marginBottom: 2,
    })),
    label: day,
    spacing: 36,
    labelTextStyle: {
      color: "gray",
      fontSize: 12,
      fontFamily: 'Cafe24SsurroundAir',
    },
  }));

  const renderTitle = () => (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginVertical: 32,
      }}
    >
      {categories.map((category, index) => (
        <View
          key={category}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 4,
              backgroundColor: colors[index],
              marginRight: 4,
            }}
          />
          <Text style={{
            width: 24,
            height: 16,
            color: "gray",
            fontSize: 12,
            fontFamily: 'Cafe24SsurroundAir',
          }}>
            {category}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={{ marginTop: 40 }}>
      <BarChart
        stackData={stackData}
        barWidth={12}
        barBorderRadius={4}
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
          ...Object.values(weeklyVolume).map((day) =>
            Object.values(day).reduce((sum, value) => sum + (isNaN(value) ? 0 : value), 0)
          )
        )}
        width={400}
        formatYLabel={(label) => {
          if (+label >= 1000000) return (label / 1000000).toFixed(1) + "M";
          if (+label >= 1000) return (label / 1000).toFixed(1) + "K";
          return label;
        }}
        showReferenceLine1
        referenceLine1Position={lastWeekAverage}
        referenceLine1Config={{
          color: "gray",
          dashWidth: 2,
          dashGap: 3,
        }}
      />
      {renderTitle()}
    </View>
  );
}

export default ExerciseChart;
