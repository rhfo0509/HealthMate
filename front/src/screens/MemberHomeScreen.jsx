import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { isAfter } from "date-fns";

import { useUserContext } from "../contexts/UserContext";
import { getUser } from "../lib/users";
import { getMemberSchedules } from "../lib/schedules";
import { getMembership } from "../lib/memberships";
import MembershipCard from "../components/MembershipCard";
import UpcomingScheduleList from "../components/UpcomingScheduleList";
import IconRightButton from "../components/IconRightButton";
import { colors, spacing } from "../styles/theme";

function MemberHomeScreen() {
  const { user } = useUserContext();
  const navigation = useNavigation();
  const [membership, setMembership] = useState(null);
  const [scheduleList, setScheduleList] = useState([]);

  useEffect(() => {
    // 회원권 정보 가져오기
    getMembership(user.id).then(async (membership) => {
      if (membership) {
        const trainer = await getUser(membership.trainerId);
        setMembership({ ...membership, trainer });
      } else {
        setMembership(null);
      }
    });

    // 다가오는 일정 가져오기
    getMemberSchedules(user.id).then((schedules) => {
      const futureSchedules = schedules.filter((schedule) =>
        isAfter(new Date(schedule.date), new Date())
      );
      futureSchedules.sort((a, b) => {
        const diffA = Math.abs(new Date() - new Date(a.date));
        const diffB = Math.abs(new Date() - new Date(b.date));
        return diffA - diffB;
      });
      Promise.all(
        futureSchedules.slice(0, 3).map(async (schedule) => {
          const trainer = await getUser(schedule.trainerId);
          return { ...schedule, trainer };
        })
      ).then((schedulesWithTrainers) => {
        setScheduleList(schedulesWithTrainers);
      });
    });
  }, [user.id]);

  useEffect(() => {
    navigation.setOptions({
      title: "HealthMate",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>나의 회원권</Text>
      <MembershipCard membership={membership} />
      <UpcomingScheduleList scheduleList={scheduleList} user={user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleText: {
    fontFamily: "Cafe24Ssurround",
    fontSize: 24,
    color: colors.primary[500],
    padding: spacing.md,
  },
});

export default MemberHomeScreen;
