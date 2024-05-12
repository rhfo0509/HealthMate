import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import Avatar from "./Avatar";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import useActions from "../hooks/useActions";
import { FlatList } from "react-native-gesture-handler";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { getSubComments } from "../lib/comments";

function CommentCard({ createdAt, content, id, user, postId, parentId }) {
  const navigation = useNavigation();
  const date = useMemo(
    () => (createdAt ? new Date(createdAt.seconds * 1000) : new Date()),
    [createdAt]
  );
  const { user: me } = useUserContext();
  const isMyComment = me.id === user.id;
  const [subcomments, setSubcomments] = useState([]);
  const firestore = getFirestore();
  const subcommentsCollection = collection(
    firestore,
    `posts/${postId}/comments/${id}/subcomments`
  );

  // subcomments 컬렉션에 변화 발생시
  useEffect(() => {
    const q = query(subcommentsCollection, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subcomments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubcomments(subcomments);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getSubComments({ postId, commentId: id }).then((subcomments) => {
      if (subcomments.length) {
        setSubcomments(subcomments);
      }
    });
  }, []);

  const onPress = () => {
    navigation.navigate("UploadComment", { postId, commentId: id });
  };
  // postId가 있으면 댓글, 없으면 게시글 / 부모 댓글(parentId)이 있으면 대댓글, 아니라면 댓글
  const { onPressMore } = useActions({ id, content, postId, parentId });

  const renderItem = ({ item }) => (
    <CommentCard
      createdAt={item.createdAt}
      content={item.content}
      id={item.id} // 대댓글 id
      user={item.user}
      postId={postId} // 게시글 id
      parentId={id} // 댓글 id
    />
  );

  return (
    <View style={styles.block}>
      <FlatList
        style={{ backgroundColor: "white" }}
        data={subcomments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <Pressable
            style={[styles.block, parentId ? styles.sub : null]}
            android_ripple={{ color: "#ededed" }}
            onPress={onPress}
            disabled={parentId ? true : false}
          >
            <View style={[styles.head, styles.paddingBlock]}>
              <View style={styles.profile}>
                <Avatar source={user.photoURL && { uri: user.photoURL }} />
                {/* TODO: 일단 트레이너 기준으로 화면을 설계하였기 때문에 "트레이너"로 설정, 후에 회원 기준 화면을 설계할 때 분기처리하기 */}
                <Text style={styles.displayName}>
                  {user.displayName} 트레이너
                </Text>
              </View>
              {isMyComment && (
                <Pressable hitSlop={8} onPress={onPressMore}>
                  <MaterialIcons name="more-vert" size={20} />
                </Pressable>
              )}
            </View>
            <View style={styles.paddingBlock}>
              <Text style={styles.content}>{content}</Text>
              <Text date={date} style={styles.date}>
                {date.toLocaleString()}
              </Text>
            </View>
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingVertical: 8,
  },
  separator: {
    backgroundColor: "#e0e0e0",
    height: 1,
    width: "100%",
  },
  paddingBlock: {
    paddingHorizontal: 16,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  displayName: {
    lineHeight: 24,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
  image: {
    backgroundColor: "#bdbdbd",
    width: "100%",
    aspectRatio: 1,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  date: {
    color: "#757575",
    fontSize: 12,
    lineHeight: 18,
  },
  sub: {
    paddingLeft: 30,
  },
});

export default CommentCard;
