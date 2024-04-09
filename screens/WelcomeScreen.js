import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SetupProfile from "../components/SetupProfile";

function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.block}>
      <Text style={styles.title}>환영합니다!</Text>
      <Text style={styles.description}>프로필을 설정하세요.</Text>
      <SetupProfile />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 48,
  },
  description: {
    marginTop: 16,
    fontSize: 21,
    color: "#757575",
  },
});

export default WelcomeScreen;
