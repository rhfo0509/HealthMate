import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DietScreen from "./DietScreen";
import ExerciseScreen from "./ExerciseScreen";
import { View } from "react-native";

const Tab = createMaterialTopTabNavigator();

function MemberDetailScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6200ee",
        tabBarLabelStyle: { color: "black" },
      }}
    >
      <Tab.Screen
        name="Diet"
        component={DietScreen}
        options={{
          tabBarLabel: "오늘의 식단",
        }}
      />
      <Tab.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={{ tabBarLabel: "오늘의 운동" }}
      />
    </Tab.Navigator>
  );
}

export default MemberDetailScreen;
