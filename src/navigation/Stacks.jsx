import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUserContext } from "../contexts/UserContext";
import CalendarScreen from "../screens/trainer/CalendarScreen";
import WeeklyCalendarScreen from "../screens/trainer/WeeklyCalendarScreen";
import { getRole } from "../lib/users";
import MemberHomeScreen from "../screens/member/MemberHomeScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import MemberDetailTab from "./MemberDetailTab";

const Stack = createNativeStackNavigator();

// HomeStack
function HomeStack() {
  const { user } = useUserContext();
  const [role, setRole] = useState("");

  useEffect(() => {
    (async () => {
      const result = await getRole(user.id);
      setRole(result);
    })();
  }, [user.id]);

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

// MyProfileStack
function MyProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      <Stack.Screen name="MemberDetail" component={MemberDetailTab} />
    </Stack.Navigator>
  );
}

export { HomeStack, MyProfileStack };
