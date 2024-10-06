import React, { useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRoute, useNavigation } from "@react-navigation/native";
import DashboardScreen from "../screens/DashboardScreen";
import DietScreen from "../screens/DietScreen";
import ExerciseScreen from "../screens/ExerciseScreen";
import IconRightButton from "../components/IconRightButton";

const Tab = createMaterialTopTabNavigator();

function MemberDetailTab() {
  const route = useRoute();
  const navigation = useNavigation();
  const { relatedUser, role } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title:
        role === "member"
          ? `${relatedUser.displayName} 회원`
          : `${relatedUser.displayName} 트레이너`,
      headerRight: () =>
        role === "member" ? (
          <IconRightButton
            name="remember-me"
            onPress={() =>
              navigation.push("Membership", { memberId: relatedUser.id })
            }
          />
        ) : null,
    });
  }, [navigation, relatedUser]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1f6feb",
        tabBarLabelStyle: { color: "black" },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: "대시보드" }}
        initialParams={{ relatedUserId: relatedUser.id }}
      />
      <Tab.Screen
        name="Diet"
        component={DietScreen}
        options={{
          tabBarLabel: "식단일지",
        }}
        initialParams={{ relatedUserId: relatedUser.id, postType: "Diet" }}
      />
      <Tab.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={{ tabBarLabel: "운동일지" }}
        initialParams={{
          relatedUserId: relatedUser.id,
          postType: "Exercise",
        }}
      />
    </Tab.Navigator>
  );
}

export default MemberDetailTab;
