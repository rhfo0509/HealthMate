import React from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import MemberListItem from "./MemberListItem";
import {
  SwipeableFlatList,
  SwipeableQuickActionButton,
  SwipeableQuickActions,
} from "react-native-swipe-list";
import { removeMemberByTrainer } from "../lib/users";
import { useUserContext } from "../contexts/UserContext";

function MemberList({ members, ListHeaderComponent }) {
  const { user } = useUserContext();
  return (
    <SwipeableFlatList
      data={members}
      style={styles.block}
      renderItem={({ item }) => <MemberListItem member={item} />}
      keyExtractor={(member) => member.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={ListHeaderComponent}
      renderRightActions={({ item }) => (
        <SwipeableQuickActions>
          <SwipeableQuickActionButton
            onPress={() => {
              Alert.alert(
                "회원 삭제",
                "회원을 삭제하시겠습니까?",
                [
                  {
                    text: "취소",
                    style: "cancel",
                  },
                  {
                    text: "확인",
                    onPress: () => {
                      removeMemberByTrainer(user.id, item.id);
                    },
                  },
                ],
                { cancelable: true }
              );
            }}
            text="삭제"
            textStyle={{ fontWeight: "bold", color: "white" }}
            style={{
              flex: 1,
              paddingHorizontal: 30,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "crimson",
            }}
          />
        </SwipeableQuickActions>
      )}
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
