import React from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import { formatDistanceToNow, format } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native";

function MemberListItem({ member }) {
  console.log(member);
  const { displayName, birthDate, phoneNumber } = member; // 사용하기 편하게 객체 구조 분해 할당
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("MemberDetail", {
      member,
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.block,
        Platform.OS === "ios" && pressed && { backgroundColor: "#efefef" },
      ]}
      android_ripple={{ color: "#ededed" }}
      onPress={onPress}
    >
      <Text style={styles.date}>{birthDate}</Text>
      <Text style={styles.title}>{displayName}</Text>
      <Text style={styles.body}>{phoneNumber}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  date: {
    fontSize: 12,
    color: "#546e7a",
    marginBottom: 8,
  },
  title: {
    color: "#263238",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  body: {
    color: "#37474f",
    fontSize: 16,
    lineHeight: 21,
  },
});

export default MemberListItem;
