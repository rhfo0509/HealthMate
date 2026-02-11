import React, { useState } from "react";
import {
  SafeAreaView,
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useUserContext } from "../contexts/UserContext";
import { logIn, signUp } from "../lib/auth";
import { getUser } from "../lib/users";
import SignForm from "../components/SignForm";
import SignButtons from "../components/SignButtons";
import { colors } from "../styles/theme";

function SignInScreen({ navigation, route }) {
  const { setUser } = useUserContext();
  const { isSignUp } = route.params ?? {};
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState();

  const createChangeTextHandler = (name) => (value) => {
    setForm({ ...form, [name]: value });
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    const { email, password } = form;
    const info = { email, password };
    setLoading(true);
    try {
      const { user } = isSignUp ? await signUp(info) : await logIn(info);
      const profile = await getUser(user.uid);
      if (!profile) {
        navigation.navigate("Welcome", { uid: user.uid });
      } else {
        setUser(profile);
      }
    } catch (e) {
      console.log(e.code);
      const messages = {
        "auth/email-already-in-use": "이미 가입된 이메일입니다.",
        "auth/wrong-password": "잘못된 비밀번호입니다.",
        "auth/user-not-found": "존재하지 않는 계정입니다.",
        "auth/invalid-email": "유효하지 않은 이메일 주소입니다.",
      };
      const msg = messages[e.code] || `${isSignUp ? "가입" : "로그인"} 실패`;
      Alert.alert("실패", msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>HealthMate</Text>
      <Text style={styles.description}>
        회원과 트레이너를 위한 PT 관리 플랫폼
      </Text>
      <View style={styles.form}>
        <SignForm
          isSignUp={isSignUp}
          onSubmit={onSubmit}
          form={form}
          createChangeTextHandler={createChangeTextHandler}
        />
        <SignButtons
          isSignUp={isSignUp}
          onSubmit={onSubmit}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 48,
    fontFamily: 'Cafe24Ssurround',
    color: colors.primary[500],
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Cafe24SsurroundAir',
  },
  form: {
    marginTop: 64,
    width: "100%",
    paddingHorizontal: 16,
  },
});

export default SignInScreen;
