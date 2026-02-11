import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useUserContext } from "../contexts/UserContext";
import { logOut } from "../lib/auth";
import { colors, spacing } from "../styles/theme";

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
    paddingTop: spacing.xl,
    backgroundColor: colors.surface,
  },
  item: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  itemText: {
    fontFamily: "Paperlogy-Medium",
    fontSize: 16,
    color: colors.text.primary,
  },
});

export default SettingScreen;
