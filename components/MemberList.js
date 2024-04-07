import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import MemberListItem from "./MemberListItem";

function MemberList({ members, ListHeaderComponent }) {
  return (
    <FlatList
      data={members}
      style={styles.block}
      renderItem={({ item }) => <MemberListItem member={item} />}
      keyExtractor={(member) => member.id}
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

export default MemberList;
