import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Avatar from "./Avatar";
import BodyHistoryChart from "./BodyHistoryChart";

function MemberProfile({ user }) {
  return (
    <View style={styles.block}>
      <View style={styles.userInfo}>
        <Avatar source={user.photoURL && { uri: user.photoURL }} size={128} />
        <Text style={styles.username}>
          {user.displayName} 회원님 환영합니다!
        </Text>
      </View>
      <BodyHistoryChart />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
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
});

export default MemberProfile;
