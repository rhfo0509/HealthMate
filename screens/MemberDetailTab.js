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
      // TODO: 일단 트레이너 기준으로 화면을 설계하였기 때문에 "회원"으로 설정, 후에 회원 기준 화면을 설계할 때 분기처리하기
      title: `${member.displayName} 회원`,
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
