// 홈 화면에서 다른 사용자의 프로필을 누를 때는 ProfileScreen
// 하단 두번째 탭인 사용자 탭을 누를 때 보여지는 MyProfileScreen
// 즉, 프로필이 보여지는 화면이 두 개이기 때문에 Profile 컴포넌트를 따로 만듦

import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { getMembersByTrainer, getUser } from "../lib/users";
import Avatar from "./Avatar";
import MemberList from "./MemberList";
import MemberSearchBar from "./MemberSearchBar";

function Profile({ userId }) {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getUser(userId).then(setUser);
      getMembersByTrainer(userId).then(setMembers);
    }, [userId])
  );

  if (!user || !members) {
    return (
      <ActivityIndicator style={styles.spinner} size={32} color="#6200ee" />
    );
  }

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
              {/* <Text style={{ fontSize: 16 }}>회원 목록</Text> */}
              <MemberSearchBar
                members={members}
                setFilteredMembers={setFilteredMembers}
              />
            </View>
          </>
        }
        members={filteredMembers.length > 0 ? filteredMembers : members}
      />
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

export default Profile;
