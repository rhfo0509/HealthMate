import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { StyleSheet, View, FlatList } from "react-native";
import { getPosts } from "../lib/posts";
import CalendarHeader from "../components/CalendarHeader";
import WriteButton from "../components/WriteButton";
import PostCard from "../components/PostCard";
import { useUserContext } from "../contexts/UserContext";

function DietScreen() {
  const route = useRoute();
  const [posts, setPosts] = useState(null);
  const { memberId, postType } = route.params;
  const { user } = useUserContext();

  useEffect(() => {
    getPosts(user.id, memberId, postType).then(setPosts);
  }, []);

  return (
    <View style={styles.block}>
      <CalendarHeader />
      <FlatList
        style={{ marginTop: 100, backgroundColor: "white" }}
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <WriteButton postType={postType} memberId={memberId} />
    </View>
  );
}

const renderItem = ({ item }) => (
  <PostCard
    createdAt={item.createdAt}
    description={item.description}
    id={item.id}
    user={item.user}
    photoURL={item.photoURL}
  />
);

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
});

export default DietScreen;
