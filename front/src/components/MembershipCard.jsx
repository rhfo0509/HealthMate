import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Avatar from "./Avatar";
import { LinearGradient } from "expo-linear-gradient";

function MembershipCard({ membership }) {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("MemberDetail", {
      relatedUser: membership.trainer,
    });
  };

  return (
    <LinearGradient
      // 그라데이션 색상 설정
      colors={["#1f6feb", "#4a90e2"]}
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
  card: {
    borderRadius: 8,
    padding: 16,
    margin: 4,
  },
  status: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    color: "#1f6feb",
    fontWeight: "bold",
  },
  trainerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  trainerName: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
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
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  detailText: {
    fontSize: 16,
    color: "#fff",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    color: "#1f6feb",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MembershipCard;
