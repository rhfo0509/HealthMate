import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { useUserContext } from "../contexts/UserContext";
import { logOut } from "../lib/auth";

function NotifyScreen() {
  const { setUser } = useUserContext();

  const onLogout = async () => {
    await logOut();
    setUser(null);
  };
  return (
    <View style={styles.block}>
      <Pressable onPress={onLogout} style={({ pressed }) => [styles.item]}>
        <Text style={styles.itemText}>로그아웃</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    paddingTop: 32,
  },
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
  },
});

export default NotifyScreen;
