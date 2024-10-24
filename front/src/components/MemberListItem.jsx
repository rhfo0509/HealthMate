import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { differenceInYears, parse } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import Avatar from "./Avatar";

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

  const onPress = () => {
    navigation.navigate("MemberDetail", {
      relatedUser: member,
      role: "trainer",
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
      style={styles.container}
      android_ripple={{ color: "#ededed" }}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Avatar source={photoURL && { uri: photoURL }} size={56} />
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{displayName}</Text>
          <Text style={styles.subText}>
            {calculateAge(birthDate)}세 / {gender === "Male" ? "남" : "여"}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {status === "active"
              ? `${remaining} / ${count}회 남음`
              : status === "paused"
              ? "중단됨"
              : "만료됨"}
          </Text>
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
