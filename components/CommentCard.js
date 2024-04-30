import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import Avatar from "./Avatar";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import useActions from "../hooks/useActions";
import CommentModal from "../components/CommentModal";
import { FlatList } from "react-native-gesture-handler";
import { getSubComments } from "../lib/comments";

function CommentCard({ user, createdAt, id, postId, content, isSub }) {
  const navigation = useNavigation();
  const date = useMemo(
    () => (createdAt ? new Date(createdAt.seconds * 1000) : new Date()),
    [createdAt]
  );
  const { user: me } = useUserContext();
  const isMyComment = me.id === user.id;
  const [showModal, setShowModal] = useState(false);
  const [subcomments, setSubcomments] = useState([]);

  useEffect(() => {
    getSubComments({ postId, commentId: id }).then(setSubcomments);
  }, []);

  const onPress = () => {
    setShowModal(true);
  };
  // postId가 있으면 댓글, 없으면 게시글
  const { onPressMore } = useActions({ id, content, postId });

  const renderItem = ({ item }) => (
    <CommentCard
      createdAt={item.createdAt}
      content={item.content}
      id={item.id}
      postId={id}
      user={item.user}
      isSub={true}
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
            style={[styles.block, isSub ? styles.sub : null]}
            android_ripple={{ color: "#ededed" }}
            onPress={onPress}
            disabled={isSub ? true : false}
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
      <CommentModal
        showModal={showModal}
        setShowModal={setShowModal}
        postId={postId}
        commentId={id}
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
