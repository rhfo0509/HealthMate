import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";

import { useUserContext } from "../contexts/UserContext";
import { getRole } from "../lib/users";
import { HomeStack, MyProfileStack } from "./Stacks";
import NotifyScreen from "../screens/NotifyScreen";
import SettingScreen from "../screens/SettingScreen";
import { colors } from "../styles/theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 알림 Stack Navigator
function NotifyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Cafe24Ssurround',
          color: colors.primary[500],
        },
        headerTintColor: colors.primary[500],
      }}
    >
      <Stack.Screen
        name="Notify"
        component={NotifyScreen}
        options={{
          title: "HealthMate",
        }}
      />
    </Stack.Navigator>
  );
}

// 설정 Stack Navigator
function SettingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Cafe24Ssurround',
          color: colors.primary[500],
        },
        headerTintColor: colors.primary[500],
      }}
    >
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          title: "HealthMate",
        }}
      />
    </Stack.Navigator>
  );
}

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
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border.light,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Cafe24SsurroundAir',
          marginTop: -4,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          headerShown: false,
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
        component={NotifyStack}
        options={{
          headerShown: false,
          tabBarLabel: "알림",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="notifications-none" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyProfileTab"
        component={MyProfileStack}
        options={{
          headerShown: false,
          tabBarLabel: "MY",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingTab"
        component={SettingStack}
        options={{
          headerShown: false,
          tabBarLabel: "설정",
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
