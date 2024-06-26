import React from "react";
import { LineChart } from "react-native-gifted-charts";

function BodyChart({ mode, weightData, SMMData, PBFData }) {
  return (
    <LineChart
      data={mode == "weight" ? weightData : mode == "SMM" ? SMMData : PBFData}
      height={120}
      width={340}
      thickness={3}
      endSpacing={20}
      adjustToWidth
      showVerticalLines
      color1={mode == "weight" ? "red" : mode == "SMM" ? "blue" : "orange"}
      textShiftY={-4}
      textShiftX={-6}
      textFontSize={12}
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
