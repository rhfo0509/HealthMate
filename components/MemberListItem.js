import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { differenceInYears, parse } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import Avatar from "./Avatar";

function MemberListItem({ member }) {
  const { displayName, birthDate, gender, photoURL } = member;
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("MemberDetail", {
      member,
    });
  };

  const calculateAge = (birthDate) => {
    const diff =
      differenceInYears(
        Date.now(),
        parse(birthDate, "yyyy-MM-dd", new Date())
      ) + 1;
    return diff;
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.block]}
      android_ripple={{ color: "#ededed" }}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar source={member.photoURL && { uri: member.photoURL }} />
        <Text style={styles.text}>{displayName}</Text>
        <Text style={styles.text}>
          ({calculateAge(birthDate)}/{gender === "Male" ? "남" : "여"})
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 5,
  },
  text: {
    color: "#37474f",
    fontSize: 16,
    paddingLeft: 8,
  },
});

export default MemberListItem;
