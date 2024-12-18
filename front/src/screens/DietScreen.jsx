import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { isSameDay } from "date-fns";
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

function DietScreen() {
  const route = useRoute();
  const { relatedUserId, postType } = route.params;
  const { user: author } = useUserContext();

  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const firestore = getFirestore();
  const postsCollection = collection(firestore, "posts");

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

  // 각 식사 섹션별로 포스트를 필터링
  const filterPostsByDietType = (dietType) =>
    posts.filter(
      (post) =>
        post.dietType === dietType &&
        isSameDay(post.createdAt?.toDate(), selectedDate)
    );

  return (
    <View style={styles.container}>
      <CalendarHeader
        markedDates={posts.map((post) => ({
          date: post.createdAt?.toDate(),
          dots: [{ color: "#1f6feb", selectedColor: "#1f6feb" }],
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
