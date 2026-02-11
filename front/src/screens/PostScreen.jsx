import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
} from "firebase/firestore";

import { getComments } from "../lib/comments";
import PostCard from "../components/PostCard";
import CommentCard from "../components/CommentCard";
import IconRightButton from "../components/IconRightButton";
import { colors } from "../styles/theme";

function PostScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { author, URL, content: initialContent, createdAt, id } = route.params;

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState(initialContent);

  const firestore = getFirestore();
  const commentsCollection = collection(firestore, `posts/${id}/comments`);

  // comments 컬렉션에 변화 발생시
  useEffect(() => {
    const q = query(commentsCollection, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // posts 컬렉션에 변화 발생시
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, "posts", id), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setContent(data.content);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [content]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconRightButton onPress={onPress} name="add-comment" />
      ),
    });
  }, [navigation, onPress]);

  const renderItem = ({ item }) => (
    <CommentCard
      createdAt={item.createdAt}
      content={item.content}
      id={item.id} // 댓글 id
      author={item.author}
      postId={id} // 게시글 id
      parentId={null} // 대댓글이 아니므로 null
    />
  );

  const onPress = () => {
    navigation.navigate("Comment", { postId: id });
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ backgroundColor: colors.surface }}
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <PostCard
            createdAt={createdAt}
            content={content}
            id={id}
            author={author}
            URL={URL}
            isDetailMode={true}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    backgroundColor: colors.border.light,
    height: 1,
    width: "100%",
  },
});

export default PostScreen;
