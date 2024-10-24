import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useUserContext } from "../contexts/UserContext";
import { getUser } from "../lib/users";
import { subscribeAuth } from "../lib/auth";

// Screens
import MainTab from "./MainTab";
import DietPostScreen from "../screens/DietPostScreen";
import ExercisePostScreen from "../screens/ExercisePostScreen";
import RoutineScreen from "../screens/RoutineScreen";
import PostScreen from "../screens/PostScreen";
import ModifyScreen from "../screens/ModifyScreen";
import CommentScreen from "../screens/CommentScreen";
import FoodSearchScreen from "../screens/FoodSearchScreen";
import ExerciseSearchScreen from "../screens/ExerciseSearchScreen";
import MyRoutineScreen from "../screens/MyRoutineScreen";
import NotifyScreen from "../screens/NotifyScreen";
import AddMembershipScreen from "../screens/AddMembershipScreen";
import MembershipScreen from "../screens/MembershipScreen";
import SettingScreen from "../screens/SettingScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import SignInScreen from "../screens/SignInScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createNativeStackNavigator();

function Root() {
  const { user, setUser } = useUserContext();
  const [loading, setLoading] = useState(true);

  // 앱을 재시작해도 로그인한 상태를 유지
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
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1f6feb" />
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
            name="Routine"
            component={RoutineScreen}
            options={{ title: "오늘의 운동루틴" }}
          />
          <Stack.Screen
            name="Post"
            component={PostScreen}
            options={{ title: "게시글" }}
          />
          <Stack.Screen
            name="Modify"
            component={ModifyScreen}
            options={{ title: "수정" }}
          />
          <Stack.Screen
            name="Comment"
            component={CommentScreen}
            options={{ title: "댓글 작성" }}
          />
          <Stack.Screen
            name="FoodSearch"
            component={FoodSearchScreen}
            options={{ title: "음식 검색 결과" }}
          />
          <Stack.Screen
            name="ExerciseSearch"
            component={ExerciseSearchScreen}
            options={{ title: "운동 검색 결과" }}
          />
          <Stack.Screen
            name="MyRoutine"
            component={MyRoutineScreen}
            options={{ title: "나의 루틴" }}
          />
          <Stack.Screen
            name="Notify"
            component={NotifyScreen}
            options={{ title: "알림" }}
          />
          <Stack.Screen
            name="AddMembership"
            component={AddMembershipScreen}
            options={{ title: "회원 및 회원권 추가" }}
          />
          <Stack.Screen
            name="Membership"
            component={MembershipScreen}
            options={{ title: "회원권 관리" }}
          />
          <Stack.Screen
            name="Setting"
            component={SettingScreen}
            options={{ title: "설정" }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: "회원정보 수정" }}
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default Root;
