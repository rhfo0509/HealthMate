import React from "react";
import { Alert, StyleSheet } from "react-native";
import {
  SwipeableFlatList,
  SwipeableQuickActionButton,
  SwipeableQuickActions,
} from "react-native-swipe-list";

import { useUserContext } from "../contexts/UserContext";
import { removeMemberByTrainer } from "../lib/users";
import { removeSchedules } from "../lib/schedules";
import { removeMembership } from "../lib/memberships";
import MemberListItem from "./MemberListItem";

function MemberList({ members, memberships, ListHeaderComponent }) {
  const { user } = useUserContext();

  // 회원권 상태, 횟수, 잔여횟수가 추가된 회원 목록
  const membersWithStatus = members.map((member) => {
    const membership = memberships.find(
      (membership) => membership.memberId === member.id
    );
    if (membership) {
      return {
        ...member,
        status: membership.status,
        count: membership.count,
        remaining: membership.remaining,
      };
    }
    return member;
  });

  return (
    <SwipeableFlatList
      data={membersWithStatus}
      style={styles.memberList}
      renderItem={({ item }) => <MemberListItem member={item} />}
      keyExtractor={(member) => member.id}
      ListHeaderComponent={ListHeaderComponent}
      // 오른쪽으로 스와이프 시 삭제 버튼 렌더링
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
                      // 회원 스케줄, 회원권, 회원 정보 일괄 삭제
                      removeSchedules(item.id);
                      removeMembership(user.id, item.id);
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
              backgroundColor: "#d9534f",
            }}
          />
        </SwipeableQuickActions>
      )}
    />
  );
}

const styles = StyleSheet.create({
  memberList: { flex: 1 },
});

export default MemberList;
