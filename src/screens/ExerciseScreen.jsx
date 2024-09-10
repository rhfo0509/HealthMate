import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
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
  const { relatedUserId, postType } = route.params;
  const { user: author } = useUserContext();
  const firestore = getFirestore();
  const postsCollection = collection(firestore, "posts");
  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  // 최초로 ExerciseScreen 접근 시
  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await getPosts(author.id, relatedUserId, postType);
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setIsLoading(false); // 데이터를 불러온 후 로딩 상태 해제
      }
    };

    fetchData();
  }, [author.id, relatedUserId, postType]);

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
    return { date, dots: [{ color: "royalblue", selectedColor: "royalblue" }] };
  });

  const filteredPosts = posts.filter((post) => {
    if (!post.createdAt?.toDate()) return false;

    return isSameDay(
      format(post.createdAt?.toDate(), "yyyy-MM-dd"),
      format(selectedDate, "yyyy-MM-dd")
    );
  });

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="royalblue" />
      </View>
    );
  }

  return (
    <View style={styles.block}>
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
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  block: {
    flex: 1,
  },
  separator: {
    backgroundColor: "#e0e0e0",
    height: 1,
    width: "100%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
