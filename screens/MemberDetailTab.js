import React, { useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DietScreen from "./DietScreen";
import ExerciseScreen from "./ExerciseScreen";
import { View, StyleSheet } from "react-native";
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
    <View style={styles.block}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "royalblue",
          tabBarLabelStyle: { color: "black" },
        }}
      >
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
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    zIndex: 0,
  },
});

export default MemberDetailTab;
