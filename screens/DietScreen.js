import React from "react";
import { StyleSheet, View } from "react-native";
import CalendarHeader from "../components/CalendarHeader";
import WriteButton from "../components/WriteButton";

function DietScreen() {
  return (
    <View style={styles.block}>
      <CalendarHeader />
      <WriteButton type="diet" />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
});

export default DietScreen;
