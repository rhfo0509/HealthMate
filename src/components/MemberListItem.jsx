import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { differenceInYears, parse } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import Avatar from "./Avatar";
import { getRole } from "../lib/users";

function MemberListItem({ member }) {
  const {
    id,
    displayName,
    birthDate,
    gender,
    photoURL,
    status,
    count,
    remaining,
  } = member;
  const navigation = useNavigation();
  const [role, setRole] = useState("");

  useEffect(() => {
    (async () => {
      const result = await getRole(member.id);
      setRole(result);
    })();
  }, []);

  const onPress = () => {
    navigation.navigate("MemberDetail", {
      relatedUser: member,
      role,
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
      style={styles.block}
      android_ripple={{ color: "#ededed" }}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar source={photoURL && { uri: photoURL }} />
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.text}>{displayName} </Text>
          <Text>
            ({calculateAge(birthDate)}/{gender === "Male" ? "남" : "여"})
          </Text>
        </View>
        <Text style={styles.text}>
          {status === "active"
            ? `${remaining} / ${count}회 남음`
            : status === "paused"
            ? "중단됨"
            : "만료됨"}
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
