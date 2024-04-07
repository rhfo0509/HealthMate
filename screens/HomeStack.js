import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedScreen from "./FeedScreen";
import ProfileScreen from "./ProfileScreen";
import PostScreen from "./PostScreen";
import CalendarScreen from "./CalendarScreen";

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Post" component={PostScreen} />
    </Stack.Navigator>
  );
}

export default HomeStack;
