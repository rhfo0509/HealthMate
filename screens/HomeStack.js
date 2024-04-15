import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyProfileScreen from "./MyProfileScreen";
import CalendarScreen from "./CalendarScreen";

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HealthMate ··· 일정" component={CalendarScreen} />
      <Stack.Screen
        name="HealthMate ··· 내 프로필"
        component={MyProfileScreen}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
