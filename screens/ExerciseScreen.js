import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import CalendarHeader from "../components/CalendarHeader";
import { FlatList } from "react-native";
import { getPosts } from "../lib/posts";
import WriteButton from "../components/WriteButton";
import PostCard from "../components/PostCard";

function ExerciseScreen() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <View style={styles.block}>
      <CalendarHeader />
      <FlatList
        style={{ marginTop: 100 }}
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <WriteButton type="Exercise" />
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

export default ExerciseScreen;
