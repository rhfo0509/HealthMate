import React, { useState, useCallback, useEffect } from "react";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View, FlatList } from "react-native";
import CalendarHeader from "../components/CalendarHeader";
import WriteButton from "../components/WriteButton";
import PostCard from "../components/PostCard";
import { useUserContext } from "../contexts/UserContext";
import { isSameDay, format } from "date-fns";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { getPosts } from "../lib/posts";

function ExerciseScreen() {
  const route = useRoute();
  const { memberId, postType } = route.params;
  const { user } = useUserContext();
  const firestore = getFirestore();
  const postsCollection = collection(firestore, "posts");
  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 최초로 ExerciseScreen 접근 시
  useEffect(() => {
    getPosts(user.id, memberId, postType).then(setPosts);
  }, []);

  // posts 컬렉션에 변화 발생시
  // Fix: postsCollection을 dependency array로 설정하여 컬렉션에 변화가 발생할 때만 useEffect 실행
  useEffect(() => {
    const q = query(
      postsCollection,
      orderBy("createdAt", "desc"),
      where("user.id", "==", user.id),
      where("memberId", "==", memberId),
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
  }, [postsCollection]);

  // useFocusEffect(
  //   useCallback(() => {
  //     getPosts(user.id, memberId, postType).then(setPosts);
  //   }, [])
  // );

  const markedDates = posts?.map((post) => {
    const date = post.createdAt?.toDate();
    return { date, lines: [{ color: "royalblue", selectedColor: "crimson" }] };
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
        style={{ marginTop: 100, backgroundColor: "white" }}
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <WriteButton postType={postType} memberId={memberId} />
    </View>
  );
}

const renderItem = ({ item }) => (
  <PostCard
    createdAt={item.createdAt}
    content={item.content}
    id={item.id}
    user={item.user}
    photoURL={item.photoURL}
    isDetailMode={false}
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

export default ExerciseScreen;
