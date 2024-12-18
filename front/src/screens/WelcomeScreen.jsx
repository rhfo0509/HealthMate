import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import SetupProfile from "../components/SetupProfile";

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
  },
  title: {
    fontSize: 24,
  },
  description: {
    marginTop: 12,
    fontSize: 16,
    color: "#757575",
  },
});

export default WelcomeScreen;
