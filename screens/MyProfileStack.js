import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyProfileScreen from "./MyProfileScreen";
import MemberDetailTab from "./MemberDetailTab";

const Stack = createNativeStackNavigator();

function MyProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HealthMate ··· 내 프로필"
        component={MyProfileScreen}
      />
      <Stack.Screen name="MemberDetail" component={MemberDetailTab} />
    </Stack.Navigator>
  );
}

export default MyProfileStack;
