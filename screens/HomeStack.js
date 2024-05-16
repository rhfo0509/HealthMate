import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUserContext } from "../contexts/UserContext";
import CalendarScreen from "./CalendarScreen";
import WeeklyCalendarScreen from "./WeeklyCalendarScreen";
import { getRole } from "../lib/users";
import MemberHomeScreen from "./MemberHomeScreen";
import MemberDetailTab from "./MemberDetailTab";

const Stack = createNativeStackNavigator();

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

export default HomeStack;
