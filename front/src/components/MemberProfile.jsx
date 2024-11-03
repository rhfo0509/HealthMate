// MemberProfile.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Avatar from "./Avatar";

function MemberProfile({ user }) {
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Avatar source={user.photoURL && { uri: user.photoURL }} size={64} />
        <Text style={styles.username}>
          {user.displayName} 회원님 환영합니다!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: "white",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    fontSize: 18,
    color: "#424242",
    marginLeft: 12,
  },
});

export default MemberProfile;
