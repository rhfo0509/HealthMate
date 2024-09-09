import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { StyleSheet, View, FlatList } from "react-native";
import CalendarHeader from "../components/CalendarHeader";
import WriteButton from "../components/WriteButton";
import PostCard from "../components/PostCard";
import { useUserContext } from "../contexts/UserContext";
import { format, isSameDay } from "date-fns";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { getPosts } from "../lib/posts";

function DietScreen() {
  const route = useRoute();
  const { relatedUserId, postType } = route.params;
  const { user: author } = useUserContext();
  const firestore = getFirestore();
  const postsCollection = collection(firestore, "posts");
  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 최초로 DietScreen 접근 시
  useEffect(() => {
    getPosts(author.id, relatedUserId, postType).then(setPosts);
  }, []);

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
  }, []);

  const markedDates = posts?.map((post) => {
    const date = post.createdAt?.toDate();
    return { date, dots: [{ color: "royalblue", selectedColor: "royalblue" }] };
  });

  const filteredPosts = posts.filter((post) => {
    if (!post.createdAt?.toDate()) return false;

    return isSameDay(
      format(post.createdAt?.toDate(), "yyyy-MM-dd"),
      format(selectedDate, "yyyy-MM-dd")
    );
  });

  return (
    <View style={styles.block}>
      <CalendarHeader
        markedDates={markedDates}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <FlatList
        style={{ backgroundColor: "white" }}
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    dietType={item.dietType}
  />
);

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  separator: {
    backgroundColor: "#e0e0e0",
    height: 1,
    width: "100%",
  },
});

export default DietScreen;
