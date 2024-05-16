import React, { useState, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DietScreen from "./DietScreen";
import ExerciseScreen from "./ExerciseScreen";
import { View, StyleSheet } from "react-native";
import IconRightButton from "../components/IconRightButton";
import { getRole } from "../lib/users";

const Tab = createMaterialTopTabNavigator();

function MemberDetailTab() {
  const route = useRoute();
  const navigation = useNavigation();
  const { relatedUser } = route.params;
  const [role, setRole] = useState("");

  useEffect(() => {
    (async () => {
      const result = await getRole(relatedUser.id);
      setRole(result);
    })();
  }, [relatedUser.id]);

  useEffect(() => {
    navigation.setOptions({
      title:
        role === "trainer"
          ? `${relatedUser.displayName} 회원`
          : `${relatedUser.displayName} 트레이너`,
      headerRight: () =>
        role === "trainer" ? (
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
