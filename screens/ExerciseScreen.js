import React, { useState, useCallback, useEffect } from "react";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View, FlatList } from "react-native";
import { getPosts } from "../lib/posts";
import CalendarHeader from "../components/CalendarHeader";
import WriteButton from "../components/WriteButton";
import PostCard from "../components/PostCard";
import { useUserContext } from "../contexts/UserContext";
import { isSameDay, format } from "date-fns";

function ExerciseScreen() {
  const route = useRoute();
  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { memberId, postType } = route.params;
  const { user } = useUserContext();

  // useEffect(() => {
  //   getPosts(user.id, memberId, postType).then(setPosts);
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getPosts(user.id, memberId, postType).then(setPosts);
    }, [])
  );

  const markedDates = posts?.map((post) => {
    const date = post.createdAt?.toDate();
    return { date, lines: [{ color: "royalblue", selectedColor: "crimson" }] };
  });

  const filteredPosts = posts.filter((post) => {
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
    isDetailMode={false}
  />
);

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
});

export default ExerciseScreen;
