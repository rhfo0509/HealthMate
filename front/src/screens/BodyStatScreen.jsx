import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";
import { format } from "date-fns";
import { colors } from "../styles/theme";

import BodyChartButtons from "../components/BodyChartButtons";
import BodyChart from "../components/BodyChart";
import BodyHistory from "../components/BodyHistory";
import BodyDataModal from "../components/BodyDataModal";

function BodyStatScreen({ route }) {
  const { user } = route.params;

  const [show, setShow] = useState(false);
  const [editData, setEditData] = useState(null);
  const [mode, setMode] = useState("weight");
  const [weightData, setWeightData] = useState([]);
  const [SMMData, setSMMData] = useState([]);
  const [PBFData, setPBFData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const firestore = getFirestore();
  const bodyDataCollection = collection(firestore, "bodyData");

  useEffect(() => {
    const q = query(
      bodyDataCollection,
      orderBy("date", "asc"),
      where("memberId", "==", user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bodyData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBodyData([...bodyData].reverse());

      const weights = bodyData.map((history) => ({
        value: parseFloat(history.weight),
        dataPointText: history.weight,
        label: format(history.date.toDate(), "M/d"),
      }));
      const SMMs = bodyData.map((history) => ({
        value: parseFloat(history.SMM),
        dataPointText: history.SMM,
        label: format(history.date.toDate(), "M/d"),
      }));
      const PBFs = bodyData.map((history) => ({
        value: parseFloat(history.PBF),
        dataPointText: history.PBF,
        label: format(history.date.toDate(), "M/d"),
      }));

      setWeightData(weights);
      setSMMData(SMMs);
      setPBFData(PBFs);

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user.id]);

  return (
    <View style={styles.container}>
      <BodyChartButtons
        setMode={setMode}
        setShow={() => setShow(true)}
        latestData={{
          weight: bodyData[0]?.weight,
          SMM: bodyData[0]?.SMM,
          PBF: bodyData[0]?.PBF,
        }}
      />
      <BodyDataModal
        memberId={user.id}
        show={show}
        setShow={setShow}
        editData={editData}
        latestData={bodyData[0]}
      />

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary[300]} />
        </View>
      ) : bodyData.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            체성분 데이터가 존재하지 않습니다. 상단의 [+] 버튼을 눌러 자신의
            체성분을 등록하세요!
          </Text>
        </View>
      ) : (
        <>
          <BodyChart
            mode={mode}
            weightData={weightData}
            SMMData={SMMData}
            PBFData={PBFData}
          />
          <BodyHistory
            memberId={user.id}
            bodyData={bodyData}
            setShow={setShow}
            setEditData={setEditData}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataContainer: {
    flex: 1,
    marginHorizontal: 60,
    justifyContent: "center",
  },
  noDataText: {
    fontSize: 20,
    color: colors.text.secondary,
    textAlign: "center",
  },
});

export default BodyStatScreen;