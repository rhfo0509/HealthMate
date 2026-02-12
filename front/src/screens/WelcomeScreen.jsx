import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import SetupProfile from "../components/SetupProfile";

import { colors } from "../styles/theme";
function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>HealthMate에 오신 것을 환영합니다!</Text>
      <Text style={styles.description}>프로필을 설정하세요.</Text>
      <SetupProfile />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Cafe24SsurroundAir',
  },
  description: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.secondary,
  },
});

export default WelcomeScreen;
