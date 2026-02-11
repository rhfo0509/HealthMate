import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import { useUserContext } from "../contexts/UserContext";
import { getRole } from "../lib/users";
import { HomeStack, MyProfileStack } from "./Stacks";
import NotifyScreen from "../screens/NotifyScreen";
import SettingScreen from "../screens/SettingScreen";
import { colors } from "../styles/theme";

const Tab = createBottomTabNavigator();

function MainTab() {
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
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border.light,
        },
        tabBarLabelStyle: {
          fontFamily: "Paperlogy-Medium",
          fontSize: 11,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: role === "trainer" ? "캘린더" : "홈",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name={role === "trainer" ? "calendar-today" : "home"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="NotifyTab"
        component={NotifyScreen}
        options={{
          tabBarLabel: "알림",
          headerShown: true,
          title: "",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="notifications-none" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={MyProfileStack}
        options={{
          tabBarLabel: "내 정보",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingTab"
        component={SettingScreen}
        options={{
          tabBarLabel: "설정",
          headerShown: true,
          title: "",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});

export default MainTab;
