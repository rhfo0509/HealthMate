import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useUserContext } from "../contexts/UserContext";
import { getRole } from "../lib/users";

import MemberDetailTab from "./MemberDetailTab";
import CalendarScreen from "../screens/CalendarScreen";
import WeeklyCalendarScreen from "../screens/WeeklyCalendarScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import MemberHomeScreen from "../screens/MemberHomeScreen";

const Stack = createNativeStackNavigator();

function HomeStack() {
  const { user } = useUserContext();
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // user의 role(member/trainer) 확인 후 서로 다른 화면 제공
  useEffect(() => {
    (async () => {
      try {
        const result = await getRole(user.id);
        setRole(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user.id]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1f6feb" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {role === "trainer" ? (
        <>
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen
            name="WeeklyCalendar"
            component={WeeklyCalendarScreen}
            options={{ headerBackVisible: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="MemberHome" component={MemberHomeScreen} />
          <Stack.Screen name="MemberDetail" component={MemberDetailTab} />
        </>
      )}
    </Stack.Navigator>
  );
}

function MyProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      <Stack.Screen name="MemberDetail" component={MemberDetailTab} />
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

export { HomeStack, MyProfileStack };
