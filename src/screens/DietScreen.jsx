import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
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
  const [isLoading, setIsLoading] = useState(true);

  // 최초로 DietScreen 접근 시 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await getPosts(author.id, relatedUserId, postType);
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [author.id, relatedUserId, postType]);

  // posts 컬렉션에 변화 발생시 실시간 업데이트
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

  // 각 식사 섹션별로 포스트를 필터링
  const filterPostsByDietType = (dietType) =>
    posts.filter(
      (post) =>
        post.dietType === dietType &&
        isSameDay(post.createdAt?.toDate(), selectedDate)
    );

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
        markedDates={posts.map((post) => ({
          date: post.createdAt?.toDate(),
          dots: [{ color: "royalblue", selectedColor: "royalblue" }],
        }))}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <ScrollView>
        {["아침", "점심", "저녁", "간식"].map((DietType) => (
          <View key={DietType} style={styles.dietSection}>
            <Text style={styles.dietText}>{DietType}</Text>
            {filterPostsByDietType(DietType).length > 0 ? (
              filterPostsByDietType(DietType).map((post) => (
                <PostCard
                  key={post.id}
                  createdAt={post.createdAt}
                  content={post.content}
                  id={post.id}
                  author={post.author}
                  URL={post.URL}
                  isDetailMode={false}
                  postType={post.postType}
                  dietType={post.dietType}
                />
              ))
            ) : (
              <Text style={styles.noPostsText}>작성된 글이 없습니다.</Text>
            )}
          </View>
        ))}
      </ScrollView>
      <WriteButton postType={postType} relatedUserId={relatedUserId} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dietSection: {
    marginVertical: 10,
  },
  dietText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 16,
  },
  noPostsText: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginTop: 10,
  },
});

export default DietScreen;
