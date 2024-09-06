import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/SignInScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import UploadPostScreen from "../screens/UploadPostScreen";
import UploadCommentScreen from "../screens/UploadCommentScreen";
import ModifyScreen from "../screens/ModifyScreen";
import { useUserContext } from "../contexts/UserContext";
import MainTab from "./MainTab";
import { getUser } from "../lib/users";
import { subscribeAuth } from "../lib/auth";
import SettingScreen from "../screens/SettingScreen";
import PostScreen from "../screens/PostScreen";
import MembershipScreen from "../screens/MembershipScreen";
import NotifyScreen from "../screens/NotifyScreen";

const Stack = createNativeStackNavigator();

function Root() {
  const { user, setUser } = useUserContext();

  useEffect(() => {
    const unsubscribe = subscribeAuth(async (currentUser) => {
      unsubscribe();
      if (!currentUser) return;
      const profile = await getUser(currentUser.uid);
      if (profile) setUser(profile);
    });
  }, [setUser]);

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={MainTab}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UploadPost"
            component={UploadPostScreen}
            options={{ title: "새 게시글" }}
          />
          <Stack.Screen
            name="UploadComment"
            component={UploadCommentScreen}
            options={{ title: "새 댓글" }}
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

export default Root;
