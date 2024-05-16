import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";
import { getBodyHistories } from "../lib/bodyHistory";
import { format } from "date-fns";

function BodyHistoryChart({ memberId }) {
  const firestore = getFirestore();
  const bodyHistoriesCollection = collection(firestore, "bodyHistories");
  // const [bodyHistoryList, setBodyHistoryList] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [SMMData, setSMMData] = useState([]);
  const [PBFData, setPBFData] = useState([]);

  // bodyHistories 컬렉션에 변화 발생시
  useEffect(() => {
    const q = query(
      bodyHistoriesCollection,
      orderBy("date", "asc"),
      where("memberId", "==", memberId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bodyHistories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const weights = bodyHistories.map((history) => ({
        value: parseFloat(history.weight),
        dataPointText: history.weight,
        label: format(history.date.toDate(), "M/d"),
      }));
      const SMMs = bodyHistories.map((history) => ({
        value: parseFloat(history.SMM),
        dataPointText: history.SMM,
        label: format(history.date.toDate(), "M/d"),
      }));
      const PBFs = bodyHistories.map((history) => ({
        value: parseFloat(history.PBF),
        dataPointText: history.PBF,
        label: format(history.date.toDate(), "M/d"),
      }));

      setWeightData(weights);
      setSMMData(SMMs);
      setPBFData(PBFs);

      return () => {
        unsubscribe();
      };
    });
  }, []);

  useEffect(() => {
    getBodyHistories(memberId).then((bodyHistories) => {
      const weights = bodyHistories.map((history) => ({
        value: parseFloat(history.weight),
        dataPointText: history.weight,
        label: format(history.date.toDate(), "M/d"),
      }));
      const SMMs = bodyHistories.map((history) => ({
        value: parseFloat(history.SMM),
        dataPointText: history.SMM,
        label: format(history.date.toDate(), "M/d"),
      }));
      const PBFs = bodyHistories.map((history) => ({
        value: parseFloat(history.PBF),
        dataPointText: history.PBF,
        label: format(history.date.toDate(), "M/d"),
      }));

      setWeightData(weights);
      setSMMData(SMMs);
      setPBFData(PBFs);
    });
  }, []);

  return (
    <LineChart
      data={weightData}
      data2={SMMData}
      height={300}
      width={310}
      adjustToWidth
      showVerticalLines
      endSpacing={20}
      color1="red"
      color2="yellow"
      dataPointsColor1="red"
      dataPointsColor2="yellow"
      textShiftY={-4}
      textShiftX={-6}
      textFontSize={12}
      isAnimated
      noOfSections={5}
      secondaryData={PBFData}
      secondaryLineConfig={{ color: "blue", dataPointsColor: "blue" }}
      secondaryYAxis={{
        maxValue: 50,
        noOfSections: 5,
        showFractionalValues: true,
        roundToDigits: 0,
        yAxisColor: "blue",
        yAxisIndicesColor: "blue",
      }}
    />
  );
}

export default BodyHistoryChart;
