import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function IconRightButton({ name, color = "#1f6feb", onPress }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.circle}
        onPress={onPress}
        android_ripple={{ color: "#eee" }}
      >
        <MaterialIcons name={name} size={24} color={color} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: "hidden",
  },
  circle: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default IconRightButton;
