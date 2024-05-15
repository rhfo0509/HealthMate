import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import Avatar from "./Avatar";

function MembershipCard({ membership }) {
  return (
    <View key={membership.id} style={styles.item}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar
          source={
            membership.trainer.photoURL && {
              uri: membership.trainer.photoURL,
            }
          }
          size={36}
        />
        <Text style={{ fontSize: 20 }}>
          {" "}
          {membership.trainer.displayName} 트레이너
        </Text>
      </View>
      <View>
        <Text style={styles.itemText}>
          기간: {membership.startDate} ~ {membership.endDate}
        </Text>
        <Text style={styles.itemText}>
          세션: {membership.count - membership.remaining + 1}회 /{" "}
          {membership.count}회
        </Text>
        <Text style={styles.itemText}>
          계약일: {format(membership.createdAt.toDate(), "yyyy-MM-dd")}
        </Text>
        <Text style={styles.itemText}>
          상태:{" "}
          {membership.status === "active"
            ? "진행중"
            : membership.status === "paused"
            ? "중단됨"
            : "만료됨"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eeeeee",

    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  itemText: {
    fontSize: 16,
    marginVertical: 4,
  },
});

export default MembershipCard;
