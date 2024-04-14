import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function IconRightButton({ name, color, onPress }) {
  return (
    <View style={styles.block}>
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

IconRightButton.defaultProps = {
  color: "royalblue",
};

const styles = StyleSheet.create({
  block: {
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
