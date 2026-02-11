import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import CustomButton from "./CustomButton";
import { colors, spacing } from "../styles/theme";

function SignButtons({ isSignUp, onSubmit, loading }) {
  const navigation = useNavigation();

  const primaryTitle = isSignUp ? "회원가입" : "로그인";
  const secondaryTitle = isSignUp ? "로그인" : "회원가입";

  const onSecondaryButtonPress = () => {
    isSignUp
      ? navigation.goBack()
      : navigation.push("SignIn", { isSignUp: true });
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size={32} color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.buttons}>
      <CustomButton title={primaryTitle} hasMarginBottom onPress={onSubmit} />
      <CustomButton
        title={secondaryTitle}
        theme="secondary"
        onPress={onSecondaryButtonPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: spacing.xxl,
    height: 104,
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    marginTop: spacing.xxl,
  },
});

export default SignButtons;
