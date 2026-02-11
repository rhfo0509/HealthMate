import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { colors } from "../styles/theme";

import { getMembersByTrainer } from "../lib/users";
import { getMembershipsByTrainer } from "../lib/memberships";
import Avatar from "./Avatar";
import MemberList from "./MemberList";
import AddMemberButton from "./AddMemberButton";

function TrainerProfile({ user }) {
  const [memberList, setMemberList] = useState([]);
  const [filteredMemberList, setFilteredMemberList] = useState([]);
  const [membershipList, setMembershipList] = useState([]);
  const [sortBy, setSortBy] = useState("name");

  const firestore = getFirestore();
  const membershipsCollection = collection(firestore, "memberships");

  // members 컬렉션에 변화 발생시
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, `trainers/${user.id}/members`),
      (snapshot) => {
        const members = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMemberList(members);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  // memberships 컬렉션에 변화 발생시
  useEffect(() => {
    const q = query(membershipsCollection, where("trainerId", "==", user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memberships = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembershipList(memberships);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // sortBy state에 변화 발생시
  useEffect(() => {
    let sortedMembers = [...memberList];
    let sortedMemberships = [...membershipList];

    // 이름순 정렬
    if (sortBy === "name") {
      sortedMembers.sort((a, b) => a.displayName.localeCompare(b.displayName));
      setMemberList(sortedMembers);
    }
    // 잔여횟수순 정렬
    if (sortBy === "remaining") {
      sortedMemberships.sort((a, b) => a.remaining - b.remaining);
      const sortedMemberIds = sortedMemberships.map(
        (membership) => membership.memberId
      );
      const sortedMembersWithStatus = sortedMemberIds.map((memberId) =>
        memberList.find((member) => member.id === memberId)
      );
      setMemberList(sortedMembersWithStatus);
    }
  }, [sortBy]);

  return (
    <View style={styles.container}>
      <MemberList
        ListHeaderComponent={
          <>
            <View style={styles.userInfo}>
              <Avatar
                source={user.photoURL && { uri: user.photoURL }}
                size={48}
              />
              <Text style={styles.username}>
                {user.displayName} 트레이너님 환영합니다!
              </Text>
            </View>
            <View style={styles.listHeader}>
              <View style={styles.select}>
                <RNPickerSelect
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value)}
                  items={[
                    { label: "이름순", value: "name" },
                    { label: "잔여횟수순", value: "remaining" },
                  ]}
                  placeholder={{
                    label: "정렬기준 선택",
                    color: colors.border.dark,
                  }}
                />
              </View>
            </View>
          </>
        }
        members={filteredMemberList.length ? filteredMemberList : memberList}
        memberships={membershipList}
      />
      <AddMemberButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  username: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.primary,
    marginLeft: 12,
  },
  listHeader: {
    marginVertical: 5,
    marginHorizontal: 5,
  },
  select: {
    width: 150,
  },
});

export default TrainerProfile;