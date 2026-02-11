import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";

import { colors } from "../styles/theme";
const ProgressBar = ({ totalStep, currStep }) => {
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: (currStep / totalStep) * 100,
      duration: 0,
      useNativeDriver: false,
    }).start();
  });

  return (
    <>
      <View style={styles.bar}>
        <Animated.View
          style={{
            backgroundColor: colors.primary[500],
            width: animationValue.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
              extrapolate: "clamp",
            }),
            height: 3,
            borderTopRightRadius: 2,
            borderBottomRightRadius: 2,
          }}
        />
      </View>
      <Text style={styles.step}>
        {Math.round((currStep / totalStep) * 100)}%
      </Text>
    </>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  bar: {
    width: "100%",
    height: 3,
    backgroundColor: colors.border.main,
    borderRadius: 2,
    marginVertical: 10,
  },
  step: {
    color: colors.primary[500],
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
    marginTop: 5,
  },
});
