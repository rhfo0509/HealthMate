import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUserContext } from "../contexts/UserContext";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import CalendarScreen from "../screens/trainer/CalendarScreen";
import WeeklyCalendarScreen from "../screens/trainer/WeeklyCalendarScreen";
import { getRole } from "../lib/users";
import MemberHomeScreen from "../screens/member/MemberHomeScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import MemberDetailTab from "./MemberDetailTab";

const Stack = createNativeStackNavigator();

function HomeStack() {
  const { user } = useUserContext();
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="royalblue" />
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export { HomeStack, MyProfileStack };
