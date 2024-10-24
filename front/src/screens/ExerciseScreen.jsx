import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { isSameDay, format } from "date-fns";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import { useUserContext } from "../contexts/UserContext";
import CalendarHeader from "../components/CalendarHeader";
import WriteButton from "../components/WriteButton";
import PostCard from "../components/PostCard";

function ExerciseScreen() {
  const route = useRoute();
  const { relatedUserId, postType } = route.params;
  const { user: author } = useUserContext();
  const firestore = getFirestore();
  const postsCollection = collection(firestore, "posts");
  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // posts 컬렉션에 변화 발생시
  useEffect(() => {
    const q = query(
      postsCollection,
      orderBy("createdAt", "desc"),
      where("author.id", "in", [author.id, relatedUserId]),
      where("relatedUserId", "in", [author.id, relatedUserId]),
      where("postType", "==", postType)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(posts);
    });
    return () => {
      unsubscribe();
    };
  }, [author.id, relatedUserId, postType]);

  const markedDates = posts?.map((post) => {
    const date = post.createdAt?.toDate();
    return { date, dots: [{ color: "#1f6feb", selectedColor: "#1f6feb" }] };
  });

  const filteredPosts = posts.filter((post) => {
    if (!post.createdAt?.toDate()) return false;

    return isSameDay(
      format(post.createdAt?.toDate(), "yyyy-MM-dd"),
      format(selectedDate, "yyyy-MM-dd")
    );
  });

  return (
    <View style={styles.container}>
      <CalendarHeader
        markedDates={markedDates}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      {filteredPosts.length === 0 ? (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>작성된 글이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          style={{ backgroundColor: "white" }}
          data={filteredPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
      <WriteButton postType={postType} relatedUserId={relatedUserId} />
    </View>
  );
}

const renderItem = ({ item }) => (
  <PostCard
    createdAt={item.createdAt}
    content={item.content}
    id={item.id}
    author={item.author}
    URL={item.URL}
    isDetailMode={false}
    postType={item.postType}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsText: {
    fontSize: 18,
    color: "#757575",
  },
});

export default ExerciseScreen;
