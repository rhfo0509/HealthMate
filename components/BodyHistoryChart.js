import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
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

function BodyHistoryChart({ memberId, mode }) {
  const firestore = getFirestore();
  const bodyHistoriesCollection = collection(firestore, "bodyHistories");
  const [bodyHistoryData, setBodyHistoryData] = useState([]);
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

      setBodyHistoryData(bodyHistories.reverse());

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
        <Text style={styles.date}>
          {format(item.date.toDate(), "yyyy년 MM월 dd일")}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ alignItems: "center" }}>
            <Text>체중</Text>
            <Text>{item.weight}kg</Text>
            <Text>
              {Math.abs(weightDiff.toFixed(1))}kg{" "}
              {weightDiff.toFixed(1) >= 0 ? "🔺" : "🔻"}
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>골격근량</Text>
            <Text>{item.SMM}kg</Text>
            <Text>
              {Math.abs(SMMDiff.toFixed(1))}kg{" "}
              {SMMDiff.toFixed(1) >= 0 ? "🔺" : "🔻"}
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
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
    <>
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
            ? Math.floor(
                Math.min(...weightData.map((data) => data.value)) / 10
              ) * 10
            : mode == "SMM"
            ? Math.floor(Math.min(...SMMData.map((data) => data.value)) / 10) *
              10
            : Math.floor(Math.min(...PBFData.map((data) => data.value)) / 10) *
              10
        }
        noOfSections={5}
      />
      <FlatList
        style={{ marginTop: 20 }}
        data={bodyHistoryData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={true}
      />
    </>
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
  date: {
    fontWeight: "bold",
  },
  data: {
    marginTop: 5,
  },
});

export default BodyHistoryChart;
