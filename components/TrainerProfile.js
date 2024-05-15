import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { getMembersByTrainer } from "../lib/users";
import Avatar from "./Avatar";
import MemberList from "./MemberList";
import MemberSearchBar from "./MemberSearchBar";
import AddMemberButton from "./AddMemberButton";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getMembershipsByTrainer } from "../lib/memberships";

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

    if (sortBy === "name") {
      sortedMembers.sort((a, b) => a.displayName.localeCompare(b.displayName));
      setMemberList(sortedMembers);
    }
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

  useEffect(() => {
    getMembersByTrainer(user.id).then(setMemberList);
    getMembershipsByTrainer(user.id).then(setMembershipList);
  }, [user.id]);

  return (
    <View style={styles.block}>
      <MemberList
        ListHeaderComponent={
          <>
            <View style={styles.userInfo}>
              <Avatar
                source={user.photoURL && { uri: user.photoURL }}
                size={128}
              />
              <Text style={styles.username}>{user.displayName} 트레이너</Text>
            </View>
            <View style={styles.listHeader}>
              <MemberSearchBar
                members={memberList}
                setFilteredMembers={setFilteredMemberList}
              />
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
                    color: "#ced4da",
                  }}
                />
              </View>
            </View>
          </>
        }
        members={
          filteredMemberList.length > 0 ? filteredMemberList : memberList
        }
        memberships={membershipList}
      />
      <AddMemberButton />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  userInfo: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  username: {
    marginTop: 8,
    fontSize: 24,
    color: "#424242",
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
