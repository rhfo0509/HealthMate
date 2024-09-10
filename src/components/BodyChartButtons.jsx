import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function BodyChartButtons({ setMode, setShow }) {
  const buttons = [
    { text: "체중", mode: "weight" },
    { text: "골격근량", mode: "SMM" },
    { text: "체지방률", mode: "PBF" },
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
        </Pressable>
      ))}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.addButton,
          pressed && styles.pressedButton,
        ]}
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
    elevation: 2, // For subtle shadow
  },
  pressedButton: {
    backgroundColor: "#e0e0e0",
  },
  buttonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#64B5F6",
    paddingHorizontal: 10,
  },
});

export default BodyChartButtons;
