import React from "react";
import { LineChart } from "react-native-gifted-charts";
import { colors } from "../styles/theme";

function BodyChart({ mode, weightData, SMMData, PBFData }) {
  const getColorConfig = (mode) => {
    switch(mode) {
      case "weight":
        return {
          color: colors.primary[500],
          startFillColor: colors.primary[200],
          endFillColor: colors.primary[50],
        };
      case "SMM":
        return {
          color: colors.accent.main,
          startFillColor: colors.accent.light,
          endFillColor: '#F5EFE0',
        };
      case "PBF":
        return {
          color: colors.warning,
          startFillColor: '#FFE5CC',
          endFillColor: '#FFF5E6',
        };
      default:
        return {
          color: colors.primary[500],
          startFillColor: colors.primary[200],
          endFillColor: colors.primary[50],
        };
    }
  };

  const colorConfig = getColorConfig(mode);

  return (
    <LineChart
      data={mode == "weight" ? weightData : mode == "SMM" ? SMMData : PBFData}
      height={120}
      width={340}
      thickness={3}
      endSpacing={20}
      spacing={70}
      scrollToEnd
      adjustToWidth
      showVerticalLines
      areaChart
      curved
      color1={colorConfig.color}
      startFillColor={colorConfig.startFillColor}
      endFillColor={colorConfig.endFillColor}
      startOpacity={0.8}
      endOpacity={0.1}
      textShiftY={-4}
      textShiftX={-6}
      textFontSize={12}
      labelTextStyle={{ fontFamily: 'Cafe24SsurroundAir' }}
      yAxisTextStyle={{ fontFamily: 'Cafe24SsurroundAir' }}
      yAxisOffset={
        mode == "weight"
          ? Math.floor(Math.min(...weightData.map((data) => data.value)) / 10) *
            10
          : mode == "SMM"
          ? Math.floor(Math.min(...SMMData.map((data) => data.value)) / 10) * 10
          : Math.floor(Math.min(...PBFData.map((data) => data.value)) / 10) * 10
      }
      noOfSections={5}
    />
  );
}

export default BodyChart;
