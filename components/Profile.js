// 홈 화면에서 다른 사용자의 프로필을 누를 때는 ProfileScreen
// 하단 두번째 탭인 사용자 탭을 누를 때 보여지는 MyProfileScreen
// 즉, 프로필이 보여지는 화면이 두 개이기 때문에 Profile 컴포넌트를 따로 만듦

import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
  Text,
} from "react-native";
// import { getPosts } from "../lib/posts";
import { getMembersByTrainer, getUser } from "../lib/users";
import Avatar from "./Avatar";
import MemberList from "./MemberList";
import MemberSearchBar from "./MemberSearchBar";
// import PostGridItem from "./PostGridItem";

function Profile({ userId }) {
  const [user, setUser] = useState(null);
  // const [posts, setPosts] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getUser(userId).then(setUser);
      // getPosts(userId).then(setPosts);
      getMembersByTrainer(userId).then(setMembers);
    }, [userId])
  );

  // if (!user || !posts) {
  if (!user || !members) {
    return (
      <ActivityIndicator style={styles.spinner} size={32} color="#6200ee" />
    );
  }

  return (
    // <FlatList
    //   style={styles.block}
    //   data={posts}
    //   renderItem={renderItem}
    //   numColumns={3}
    //   keyExtractor={(item) => item.id}
    //   ListHeaderComponent={
    // <View style={styles.userInfo}>
    //   <Avatar source={user.photoURL && { uri: user.photoURL }} size={128} />
    //   <Text style={styles.username}>{user.displayName}</Text>
    // </View>
    //   }
    // />
    <View style={styles.block}>
      <MemberList
        ListHeaderComponent={
          <>
            <View style={styles.userInfo}>
              <Avatar
                source={user.photoURL && { uri: user.photoURL }}
                size={128}
              />
              <Text style={styles.username}>{user.displayName}</Text>
            </View>
            <MemberSearchBar
              members={members}
              setFilteredMembers={setFilteredMembers}
            />
          </>
        }
        members={filteredMembers.length > 0 ? filteredMembers : members}
      />
    </View>
  );
}

// const renderItem = ({ item }) => <PostGridItem post={item} />;

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: "center",
  },
  block: {
    flex: 1,
  },
  userInfo: {
    paddingTop: 80,
    paddingBottom: 64,
    alignItems: "center",
  },
  username: {
    marginTop: 8,
    fontSize: 24,
    color: "#424242",
  },
});

export default Profile;
