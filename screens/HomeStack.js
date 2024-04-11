import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "./ProfileScreen";
import CalendarScreen from "./CalendarScreen";

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HealthMate ··· 일정" component={CalendarScreen} />
      <Stack.Screen name="HealthMate ··· 내 프로필" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default HomeStack;
