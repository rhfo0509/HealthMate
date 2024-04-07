import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./HomeStack";
import MyProfileStack from "./MyProfileStack";
import { MaterialIcons } from "@expo/vector-icons";
import CameraButton from "../components/CameraButton";
import { StyleSheet, View } from "react-native";
import AddMemberButton from "../components/AddMemberButton";

const Tab = createBottomTabNavigator();

function MainTab() {
  return (
    <>
      <View style={styles.block}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#6200ee",
          }}
        >
          <Tab.Screen
            name="HomeStack"
            component={HomeStack}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="home" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="MyProfileStack"
            component={MyProfileStack}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="person" size={24} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
      {/* <CameraButton /> */}
      <AddMemberButton />
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    zIndex: 0,
  },
});

export default MainTab;
