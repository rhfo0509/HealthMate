import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { colors } from "../styles/theme";
function BodyChartButtons({ setMode, setShow, latestData }) {
  const buttons = [
    { text: "체중", mode: "weight", value: latestData.weight },
    { text: "골격근량", mode: "SMM", value: latestData.SMM },
    { text: "체지방률", mode: "PBF", value: latestData.PBF },
  ];

  return (
    <View style={styles.container}>
      {buttons.map((button) => (
        <Pressable
          key={button.mode}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.pressedButton,
          ]}
          onPress={() => setMode(button.mode)}
        >
          <Text style={styles.buttonText}>{button.text}</Text>
          <Text style={styles.recentValueText}>
            {button.value ? button.value : "없음"}
          </Text>
        </Pressable>
      ))}
      <Pressable
        style={[styles.button, styles.addButton]}
        onPress={() => setShow(true)}
        android_ripple={{ color: "white" }}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.gray[100],
    marginHorizontal: 5,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  pressedButton: {
    backgroundColor: colors.border.main,
  },
  buttonText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "500",
  },
  recentValueText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  addButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 16,
  },
});

export default BodyChartButtons;
