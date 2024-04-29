import React, { useEffect } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";
import { logOut } from "../lib/auth";
import IconRightButton from "../components/IconRightButton";

function MembershipScreen() {
  const navigation = useNavigation();
  const { setUser } = useUserContext();

  const onLogout = async () => {
    await logOut();
    setUser(null);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="check" />,
    });
  }, [navigation, onSubmit]);

  const onSubmit = () => {
    console.log("회원권 변경");
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

export default MembershipScreen;
