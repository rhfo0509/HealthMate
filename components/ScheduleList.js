import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { useUserContext } from "../contexts/UserContext";
import ScheduleListItem from "./ScheduleListItem";
import {
  SwipeableFlatList,
  SwipeableQuickActionButton,
  SwipeableQuickActions,
} from "react-native-swipe-list";
import { getMembersByTrainer } from "../lib/users";
import { removeSchedule } from "../lib/schedules";

function ScheduleList({ schedules, ListHeaderComponent }) {
  const [memberList, setMemberList] = useState([]);
  const { user: trainer } = useUserContext();

  useEffect(() => {
    getMembersByTrainer(trainer.id).then(setMemberList);
  }, [trainer.id]);

  return (
    <>
      <SwipeableFlatList
        data={schedules}
        style={styles.block}
        renderItem={({ item }) => <ScheduleListItem schedule={item} />}
        keyExtractor={(schedule) => schedule.id}
        ListHeaderComponent={ListHeaderComponent}
        renderRightActions={({ item }) => (
          <SwipeableQuickActions>
            <SwipeableQuickActionButton
              onPress={() => {
                Alert.alert(
                  "일정 삭제",
                  "일정을 삭제하시겠습니까?",
                  [
                    {
                      text: "취소",
                      style: "cancel",
                    },
                    {
                      text: "확인",
                      onPress: () => {
                        removeSchedule(item.id);
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
    </>
  );
}

const styles = StyleSheet.create({
  block: { flex: 1 },
});

export default ScheduleList;
