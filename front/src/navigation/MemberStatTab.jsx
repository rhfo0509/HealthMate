import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import BodyStatScreen from "../screens/BodyStatScreen";
import CalorieStatScreen from "../screens/CalorieStatScreen";
import ExerciseStatScreen from "../screens/ExerciseStatScreen";

const StatTab = createMaterialTopTabNavigator();

function MemberStatTab({ user }) {
  return (
    <StatTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1f6feb",
        tabBarLabelStyle: { color: "black" },
      }}
    >
      <StatTab.Screen
        name="BodyStat"
        component={BodyStatScreen}
        initialParams={{ user }}
        options={{ tabBarLabel: "체성분 통계" }}
      />
      <StatTab.Screen
        name="CalorieStat"
        component={CalorieStatScreen}
        options={{ tabBarLabel: "칼로리 통계" }}
      />
      <StatTab.Screen
        name="ExerciseStat"
        component={ExerciseStatScreen}
        options={{ tabBarLabel: "운동 통계" }}
      />
    </StatTab.Navigator>
  );
}

export default MemberStatTab;
