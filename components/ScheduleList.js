import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ScheduleListItem from "./ScheduleListItem";

function ScheduleList({ schedules, ListHeaderComponent }) {
  return (
    <FlatList
      data={schedules}
      style={styles.block}
      renderItem={({ item }) => <ScheduleListItem schedule={item} />}
      keyExtractor={(schedule) => schedule.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}

const styles = StyleSheet.create({
  block: { flex: 1 },
  separator: {
    backgroundColor: "#e0e0e0",
    height: 1,
    width: "100%",
  },
});

export default ScheduleList;
