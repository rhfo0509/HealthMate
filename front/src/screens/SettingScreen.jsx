import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { useUserContext } from "../contexts/UserContext";
import { logOut } from "../lib/auth";
import { useNavigation } from "@react-navigation/native";

function SettingScreen() {
  const { setUser } = useUserContext();
  const navigation = useNavigation();

  const onLogout = async () => {
    await logOut();
    setUser(null);
  };

  const onEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onEditProfile} style={styles.item}>
        <Text style={styles.itemText}>회원정보 수정</Text>
      </Pressable>
      <Pressable onPress={onLogout} style={styles.item}>
        <Text style={styles.itemText}>로그아웃</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 16,
  },
  itemText: {
    fontSize: 16,
  },
});

export default SettingScreen;
