import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import CustomButton from "./CustomButton";

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
        <ActivityIndicator size={32} color="#1f6feb" />
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
    marginTop: 64,
    height: 104,
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    marginTop: 64,
  },
});

export default SignButtons;
