import React, { useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DietScreen from "./DietScreen";
import ExerciseScreen from "./ExerciseScreen";
import { View, StyleSheet } from "react-native";

const Tab = createMaterialTopTabNavigator();

function MemberDetailTab() {
  const route = useRoute();
  const navigation = useNavigation();
  const { member } = route.params;
  useEffect(() => {
    navigation.setOptions({
      title: member.displayName,
    });
  }, [navigation, member]);

  return (
    <View style={styles.block}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#6200ee",
          tabBarLabelStyle: { color: "black" },
        }}
      >
        <Tab.Screen
          name="Diet"
          component={DietScreen}
          options={{
            tabBarLabel: "식단일지",
          }}
          initialParams={{ memberId: member.id, postType: "Diet" }}
        />
        <Tab.Screen
          name="Exercise"
          component={ExerciseScreen}
          options={{ tabBarLabel: "운동일지" }}
          initialParams={{ memberId: member.id, postType: "Exercise" }}
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
