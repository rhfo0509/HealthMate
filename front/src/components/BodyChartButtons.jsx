import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

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
    marginVertical: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  pressedButton: {
    backgroundColor: "#e0e0e0",
  },
  buttonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  recentValueText: {
    fontSize: 12,
    color: "#757575",
  },
  addButton: {
    backgroundColor: "#1f6feb",
    paddingHorizontal: 16,
  },
});

export default BodyChartButtons;
