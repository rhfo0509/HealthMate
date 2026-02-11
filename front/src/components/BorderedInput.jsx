import React from "react";
import { StyleSheet, TextInput } from "react-native";

import { colors } from "../styles/theme";

function BorderedInput({ hasMarginBottom, ...rest }, ref) {
  return (
    <TextInput
      style={[styles.input, hasMarginBottom && styles.margin]}
      placeholderTextColor={colors.text.disabled}
      ref={ref}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: colors.text.disabled,
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 48,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  margin: {
    marginBottom: 16,
  },
});

export default React.forwardRef(BorderedInput);
