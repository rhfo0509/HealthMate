import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyProfileScreen from "./MyProfileScreen";
import CalendarScreen from "./CalendarScreen";
import WeeklyCalendarScreen from "./WeeklyCalendarScreen";

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen
        name="WeeklyCalendar"
        component={WeeklyCalendarScreen}
        options={{ headerBackVisible: false }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
