import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { differenceInYears, parse } from "date-fns";
import { useNavigation } from "@react-navigation/native";

import Avatar from "./Avatar";

function MemberListItem({ member }) {
  const navigation = useNavigation();
  const { displayName, birthDate, gender, photoURL, status, count, remaining } =
    member;

  // 회원 컴포넌트 클릭 시 커뮤니티 화면으로 이동
  const onPress = () => {
    navigation.navigate("MemberDetail", {
      relatedUser: member,
      role: "trainer",
    });
  };

  // 생년월일을 기반으로 나이를 계산하는 함수
  const calculateAge = (birthDate) => {
    const diff =
      differenceInYears(
        Date.now(),
        parse(birthDate, "yyyy-MM-dd", new Date())
      ) + 1;
    return diff;
  };

  // 회원 상태 텍스트 표시 함수
  const getStatusText = () => {
    if (status === "active") {
      return `${remaining} / ${count}회 남음`;
    } else if (status === "paused") {
      return "중단됨";
    } else {
      return "만료됨";
    }
  };

  return (
    <Pressable
      style={styles.container}
      android_ripple={{ color: "#ededed" }}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Avatar source={photoURL && { uri: photoURL }} size={48} />
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{displayName}</Text>
          <Text style={styles.subText}>
            {calculateAge(birthDate)}세 / {gender === "Male" ? "남" : "여"}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#37474f",
  },
  subText: {
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
  },
  statusContainer: {
    backgroundColor: "#f0f4f8",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00796b",
  },
});

export default MemberListItem;
