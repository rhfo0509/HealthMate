import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import PostCard from "../components/PostCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import CommentCard from "../components/CommentCard";
import IconRightButton from "../components/IconRightButton";
import { FlatList } from "react-native-gesture-handler";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { getComments } from "../lib/comments";

function PostScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const [comments, setComments] = useState([]);
  const { user, photoURL, content, createdAt, id } = route.params;
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

  useEffect(() => {
    getComments(id).then(setComments);
  }, []);

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
      user={item.user}
      postId={id} // 게시글 id
      parentId={null} // 대댓글이 아니므로 null
    />
  );

  const onPress = () => {
    navigation.navigate("UploadComment", { postId: id });
  };

  return (
    <View style={styles.block}>
      <FlatList
        style={{ backgroundColor: "white" }}
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <PostCard
            createdAt={createdAt}
            content={content}
            id={id}
            user={user}
            photoURL={photoURL}
            isDetailMode={true}
          />
        }
      />
    </View>
  );
}

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

export default PostScreen;
