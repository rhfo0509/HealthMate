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

import Avatar from "./Avatar";
import BodyDataModal from "./BodyDataModal";
import BodyChartButtons from "./BodyChartButtons";
import BodyChart from "./BodyChart";
import BodyHistory from "./BodyHistory";

function MemberProfile({ user }) {
  const firestore = getFirestore();
  const bodyDataCollection = collection(firestore, "bodyData");
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("weight");
  const [weightData, setWeightData] = useState([]);
  const [SMMData, setSMMData] = useState([]);
  const [PBFData, setPBFData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

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

      setIsLoading(false); // 데이터 로딩 후 로딩 상태 해제
    });

    return () => {
      unsubscribe();
    };
  }, [user.id]);

  return (
    <View style={styles.block}>
      <View style={styles.userInfo}>
        <Avatar source={user.photoURL && { uri: user.photoURL }} size={64} />
        <Text style={styles.username}>
          {user.displayName} 회원님 환영합니다!
        </Text>
      </View>

      <View style={styles.chartInfo}>
        <BodyChartButtons setMode={setMode} setShow={setShow} />
        <BodyDataModal memberId={user.id} show={show} setShow={setShow} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#64B5F6" />
        </View>
      ) : bodyData.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            체성분 데이터가 존재하지 않습니다. 상단의 [ + ] 버튼을 눌러 자신의
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
          <BodyHistory bodyData={bodyData} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: "white",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  username: {
    fontSize: 18,
    color: "#424242",
    marginLeft: 12,
  },
  chartInfo: {
    borderTopWidth: 1,
    borderTopColor: "#ededed",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  noDataContainer: {
    flex: 1,
    marginHorizontal: 60,
    justifyContent: "center",
  },
  noDataText: {
    fontSize: 20,
    color: "#757575",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MemberProfile;
