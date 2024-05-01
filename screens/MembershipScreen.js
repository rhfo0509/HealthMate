import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";
import IconRightButton from "../components/IconRightButton";
import { getMembership } from "../lib/membership";

function MembershipScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUserContext();
  const [membership, setMembership] = useState({});

  const { memberId } = route.params;

  // const daysNumber = {
  //   일: 0,
  //   월: 1,
  //   화: 2,
  //   수: 3,
  //   목: 4,
  //   금: 5,
  //   토: 6,
  // };
  // const checkedDays = [];

  // Object.keys(membership.days).forEach((v) => {
  //   if (Object.keys(daysNumber).includes(v)) {

  //   }
  // })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="check" />,
    });
  }, [navigation, onSubmit]);

  useEffect(() => {
    getMembership(user.id, memberId).then(setMembership);
  }, [user.id, memberId]);

  const onSubmit = () => {
    console.log("회원권 변경");
  };

  const onPressPause = () => {
    // 회원권에 status라는 속성을 두어
    // 활성화 상태: active, 중단된 상태: suspended, 만료된 상태: expired로 설정
    console.log("일시중지");
  };

  const onPressExtend = () => {
    // 현재 잔여횟수를 보여주고 연장할 횟수를 입력하도록 모달을 보여줌
    console.log("횟수연장");
  };

  const onPressChange = () => {
    // 현재 요일/시간 체크 및 설정 상황을 보여주고 직접 입력하도록 모달을 보여줌
    console.log("요일/시간변경");
  };

  const showMembershipDays = () => {
    const daysOrder = ["월", "화", "수", "목", "금", "토", "일"];

    // membership.days 객체의 키를 배열로 추출
    const daysKeys = Object.keys(membership?.days || {});

    // daysKeys를 daysOrder의 순서대로 정렬
    const sortedDaysKeys = daysKeys.sort((a, b) => {
      return daysOrder.indexOf(a) - daysOrder.indexOf(b);
    });

    // 정렬된 키를 사용하여 요일 및 시간 출력
    return sortedDaysKeys.map((key) => {
      const value = membership?.days[key];
      return (
        <Text key={key} style={styles.itemText}>
          {key} {value.startTime} : {value.endTime}
        </Text>
      );
    });
  };

  return (
    <View style={styles.block}>
      <View style={styles.item}>
        <Text style={styles.itemText}>시작일자: {membership?.startDate}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.itemText}>등록횟수: {membership?.count}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.itemText}>잔여횟수: {membership?.remaining}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.itemText}>등록요일 및 시간</Text>
        {showMembershipDays()}
      </View>
      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          android_ripple={{ color: "#ededed" }}
          onPress={onPressPause}
        >
          <Text>일시중지</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          android_ripple={{ color: "#ededed" }}
          onPress={onPressExtend}
        >
          <Text>횟수연장</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          android_ripple={{ color: "#ededed" }}
          onPress={onPressChange}
        >
          <Text>요일/시간변경</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    paddingTop: 32,
  },
  item: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eeeeee",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    marginVertical: 8,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "flex",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
});

export default MembershipScreen;
