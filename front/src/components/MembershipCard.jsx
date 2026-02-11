import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../styles/theme";

import Avatar from "./Avatar";

function MembershipCard({ membership }) {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("MemberDetail", {
      relatedUser: membership.trainer,
      role: "member",
    });
  };

  if (!membership) {
    return (
      <View style={styles.noMembership}>
        <Text style={styles.noMembershipText}>
          아직 회원권이 존재하지 않습니다.
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[colors.primary[500], colors.primary[400]]}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.card}
    >
      <View style={styles.status}>
        <Text style={styles.statusText}>
          {membership.status === "active" ? "진행중" : "만료됨"}
        </Text>
      </View>

      <View style={styles.trainerInfo}>
        <Avatar
          source={
            membership.trainer.photoURL && { uri: membership.trainer.photoURL }
          }
          size={50}
        />
        <Text style={styles.trainerName}>
          {membership.trainer.displayName} 트레이너
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>기간</Text>
          <Text style={styles.detailText}>
            {membership.startDate} ~ {membership.endDate}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>세션</Text>
          <Text style={styles.detailText}>
            {membership.count - membership.remaining}회 / {membership.count}회
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>계약일</Text>
          <Text style={styles.detailText}>
            {membership.createdAt.toDate
              ? membership.createdAt.toDate().toISOString().split("T")[0]
              : membership.createdAt}
          </Text>
        </View>
      </View>

      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>커뮤니티로 이동 &gt;</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  noMembership: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMembershipText: {
    fontSize: 18,
    fontFamily: 'Cafe24SsurroundAir',
    color: "gray",
  },
  card: {
    borderRadius: 8,
    padding: 16,
    margin: 4,
  },
  status: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    color: colors.primary[500],
    fontFamily: 'Cafe24SsurroundAir',
    fontSize: 14,
  },
  trainerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  trainerName: {
    marginLeft: 12,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.background,
  },
  details: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: colors.background,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Cafe24SsurroundAir',
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.background,
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    color: colors.primary[500],
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Cafe24SsurroundAir',
  },
});

export default MembershipCard;