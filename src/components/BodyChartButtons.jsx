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
    <View style={{ flexDirection: "row", marginVertical: 10 }}>
      {buttons.map((button) => (
        <Pressable
          key={button.mode}
          style={styles.button}
          onPress={() => setMode(button.mode)}
        >
          <Text>{button.text}</Text>
        </Pressable>
      ))}
      <Pressable
        style={styles.button}
        onPress={() => setShow(true)}
        android_ripple={{ color: "white" }}
      >
        <Text>
          <MaterialIcons name="add" size={24} color="black" />
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 20,
    backgroundColor: "#ededed",
    marginHorizontal: 10,
    borderRadius: 10,
  },
});

export default BodyChartButtons;
