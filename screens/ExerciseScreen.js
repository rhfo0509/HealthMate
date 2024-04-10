import React from "react";
import { StyleSheet, View } from "react-native";
import CalendarHeader from "../components/CalendarHeader";
import WriteButton from "../components/WriteButton";

function ExerciseScreen() {
  return (
    <View style={styles.block}>
      <CalendarHeader />
      <WriteButton type="Exercise" />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
});

export default ExerciseScreen;
