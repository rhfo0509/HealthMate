import React from "react";
import { StyleSheet, View, Pressable, Text, Platform } from "react-native";

import { colors } from "../styles/theme";
function CustomButton({ onPress, title, hasMarginBottom, theme = "primary" }) {
  const isPrimary = theme === "primary";
  return (
    <View style={[styles.container, hasMarginBottom && styles.margin]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.wrapper,
          isPrimary && styles.primaryWrapper,
          Platform.OS === "ios" && pressed && { opacity: 0.5 },
        ]}
        android_ripple={{
          color: isPrimary ? colors.background : colors.primary[500],
        }}
      >
        <Text
          style={[
            styles.text,
            isPrimary ? styles.primaryText : styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overflow: {
    borderRadius: 4,
    overflow: "hidden",
  },
  wrapper: {
    borderRadius: 4,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryWrapper: {
    backgroundColor: colors.primary[500],
  },
  text: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
  },
  primaryText: {
    color: "white",
  },
  secondaryText: {
    color: colors.primary[500],
  },
  margin: {
    marginBottom: 8,
  },
});

export default CustomButton;
