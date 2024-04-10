import React from "react";
import { View, StyleSheet } from "react-native";
import CalendarStrip from "react-native-calendar-strip";

function CalendarHeader() {
  return (
    <View style={styles.block}>
      <CalendarStrip
        scrollable
        style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
        calendarColor={"white"}
        calendarHeaderStyle={{ color: "#495057" }}
        dateNumberStyle={{ color: "#495057" }}
        dateNameStyle={{ color: "#495057" }}
        iconContainer={{ flex: 0.1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: { flex: 1 },
});

export default CalendarHeader;
