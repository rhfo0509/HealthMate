import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { getMembersByTrainer } from "../lib/users";
import Avatar from "../components/Avatar";
import MemberList from "../components/MemberList";
import MemberSearchBar from "../components/MemberSearchBar";
import { useUserContext } from "../contexts/UserContext";
import IconRightButton from "../components/IconRightButton";
import AddMemberButton from "../components/AddMemberButton";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getMembershipsByTrainer } from "../lib/memberships";

function MyProfileScreen() {
  const navigation = useNavigation();
  const { user } = useUserContext();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const firestore = getFirestore();
  const membershipsCollection = collection(firestore, "memberships");

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconRightButton
          name="settings"
          onPress={() => navigation.push("Setting")}
        />
      ),
    });
  }, [navigation, user]);

  // members 컬렉션에 변화 발생시
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, `trainers/${user.id}/members`),
      (snapshot) => {
        const members = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMembers(members);
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
      setMemberships(memberships);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // sortBy state에 변화 발생시
  useEffect(() => {
    let sortedMembers = [...members];
    let sortedMemberships = [...memberships];

    if (sortBy === "name") {
      sortedMembers.sort((a, b) => a.displayName.localeCompare(b.displayName));
      setMembers(sortedMembers);
    }
    if (sortBy === "remaining") {
      sortedMemberships.sort((a, b) => a.remaining - b.remaining);
      const sortedMemberIds = sortedMemberships.map(
        (membership) => membership.memberId
      );
      const sortedMembersWithStatus = sortedMemberIds.map((memberId) =>
        members.find((member) => member.id === memberId)
      );
      setMembers(sortedMembersWithStatus);
    }
  }, [sortBy]);

  useEffect(() => {
    getMembersByTrainer(user.id).then(setMembers);
    getMembershipsByTrainer(user.id).then(setMemberships);
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
                members={members}
                setFilteredMembers={setFilteredMembers}
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
        members={filteredMembers.length > 0 ? filteredMembers : members}
        memberships={memberships}
      />
      <AddMemberButton />
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: "center",
  },
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

export default MyProfileScreen;
