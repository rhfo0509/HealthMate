import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
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

  // bodyData 컬렉션에 변화 발생시 실행
  // 처음 렌더링 시에도 실행되므로 getBodyData를 할 필요가 X
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

      return () => {
        unsubscribe();
      };
    });
  }, []);

  return (
    <View style={styles.block}>
      <View style={styles.userInfo}>
        <Avatar source={user.photoURL && { uri: user.photoURL }} size={128} />
        <Text style={styles.username}>
          {user.displayName} 회원님 환영합니다!
        </Text>
      </View>
      <View style={styles.chartInfo}>
        <BodyChartButtons setMode={setMode} setShow={setShow} />
        <BodyDataModal memberId={user.id} show={show} setShow={setShow} />
      </View>
      <BodyChart
        mode={mode}
        weightData={weightData}
        SMMData={SMMData}
        PBFData={PBFData}
      />
      <BodyHistory bodyData={bodyData} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: "white",
  },
  userInfo: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  username: {
    marginTop: 8,
    fontSize: 24,
    color: "#424242",
  },
  chartInfo: {
    borderTopWidth: 1,
    borderTopColor: "#ededed",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default MemberProfile;
