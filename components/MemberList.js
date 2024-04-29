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
import { removeSchedulesWithMember } from "../lib/schedules";
import { removeMembershipWithMember } from "../lib/membership";

function MemberList({ members, ListHeaderComponent }) {
  const { user } = useUserContext();
  return (
    <SwipeableFlatList
      data={members}
      style={styles.block}
      renderItem={({ item }) => <MemberListItem member={item} />}
      keyExtractor={(member) => member.id}
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
                    onPress: async () => {
                      removeSchedulesWithMember(user.id, item.id);
                      removeMembershipWithMember(user.id, item.id);
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
});

export default MemberList;
