import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text } from "react-native";
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
import { getMemberships } from "../lib/memberships";

function MyProfileScreen() {
  const navigation = useNavigation();
  const { user } = useUserContext();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [memberships, setMemberships] = useState([]);
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

  // useFocusEffect(
  //   useCallback(() => {
  //     getMembersByTrainer(user.id).then(setMembers);
  //   }, [user.id])
  // );

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

  useEffect(() => {
    getMembersByTrainer(user.id).then(setMembers);
    getMemberships(user.id).then(setMemberships);
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
    paddingBottom: 40,
    alignItems: "center",
  },
  username: {
    marginTop: 8,
    fontSize: 24,
    color: "#424242",
  },
  listHeader: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
});

export default MyProfileScreen;
