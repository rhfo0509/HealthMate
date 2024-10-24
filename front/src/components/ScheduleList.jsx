import React from "react";
import { StyleSheet, Alert } from "react-native";
import {
  SwipeableFlatList,
  SwipeableQuickActionButton,
  SwipeableQuickActions,
} from "react-native-swipe-list";

import { removeSchedule } from "../lib/schedules";
import ScheduleListItem from "./ScheduleListItem";

function ScheduleList({ schedules, ListHeaderComponent }) {
  return (
    <SwipeableFlatList
      data={schedules}
      style={styles.container}
      renderItem={({ item }) => <ScheduleListItem schedule={item} />}
      keyExtractor={(schedule) => schedule.id}
      ListHeaderComponent={ListHeaderComponent}
      // 오른쪽으로 스와이프 시 삭제 버튼 렌더링
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
                      // 일정을 완료 처리하지 않고 삭제
                      const isCompleted = false;
                      removeSchedule(item.id, isCompleted);
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
  container: { flex: 1 },
});

export default ScheduleList;
