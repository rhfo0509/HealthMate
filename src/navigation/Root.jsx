import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useUserContext } from "../contexts/UserContext";
import { getUser } from "../lib/users";
import { subscribeAuth } from "../lib/auth";
import MainTab from "./MainTab";

// Screens
import SignInScreen from "../screens/SignInScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import DietPostScreen from "../screens/DietPostScreen";
import ExercisePostScreen from "../screens/ExercisePostScreen";
import CommentScreen from "../screens/CommentScreen";
import ModifyScreen from "../screens/ModifyScreen";
import SettingScreen from "../screens/SettingScreen";
import PostScreen from "../screens/PostScreen";
import MembershipScreen from "../screens/trainer/MembershipScreen";
import NotifyScreen from "../screens/NotifyScreen";

const Stack = createNativeStackNavigator();

function Root() {
  const { user, setUser } = useUserContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAuth(async (currentUser) => {
      if (currentUser) {
        const profile = await getUser(currentUser.uid);
        if (profile) setUser(profile);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="royalblue" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        // 로그인 상태인 경우
        <>
          <Stack.Screen
            name="Tabs"
            component={MainTab}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DietPost"
            component={DietPostScreen}
            options={{ title: "오늘의 식단기록" }}
          />
          <Stack.Screen
            name="ExercisePost"
            component={ExercisePostScreen}
            options={{ title: "오늘의 운동기록" }}
          />
          <Stack.Screen
            name="Comment"
            component={CommentScreen}
            options={{ title: "댓글 작성" }}
          />
          <Stack.Screen
            name="Modify"
            component={ModifyScreen}
            options={{ title: "수정" }}
          />
          <Stack.Screen
            name="Setting"
            component={SettingScreen}
            options={{ title: "설정" }}
          />
          <Stack.Screen
            name="Post"
            component={PostScreen}
            options={{ title: "게시글" }}
          />
          <Stack.Screen
            name="Membership"
            component={MembershipScreen}
            options={{ title: "회원권 관리" }}
          />
          <Stack.Screen
            name="Notify"
            component={NotifyScreen}
            options={{ title: "알림" }}
          />
        </>
      ) : (
        // 비로그인 상태인 경우
        <>
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default Root;
