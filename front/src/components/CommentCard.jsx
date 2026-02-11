import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { colors } from "../styles/theme";

import { useUserContext } from "../contexts/UserContext";
import useActions from "../hooks/useActions";
import { getSubComments } from "../lib/comments";
import { getRole } from "../lib/users";
import Avatar from "./Avatar";

function CommentCard({ createdAt, content, id, author, postId, parentId }) {
  const navigation = useNavigation();
  const date = useMemo(
    () => (createdAt ? new Date(createdAt.seconds * 1000) : new Date()),
    [createdAt]
  );
  const { user } = useUserContext();
  const isMyComment = user.id === author.id;
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchRole = async () => {
      setIsLoading(true);
      const result = await getRole(author.id);
      setRole(result);
      setIsLoading(false);
    };

    fetchRole();
  }, [author.id]);

  const onPress = () => {
    navigation.navigate("Comment", { postId, commentId: id });
  };
  const { onPressMore } = useActions({ id, content, postId, parentId });

  const renderItem = ({ item }) => (
    <CommentCard
      createdAt={item.createdAt}
      content={item.content}
      id={item.id}
      author={item.author}
      postId={postId}
      parentId={id}
    />
  );

  return (
    <View style={styles.card}>
      <FlatList
        style={{ backgroundColor: colors.surface }}
        data={subcomments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <Pressable
            style={[styles.cardContent, parentId ? styles.sub : null]}
            android_ripple={{ color: colors.border.light }}
            onPress={onPress}
            disabled={parentId ? true : false}
          >
            <View style={styles.header}>
              <View style={styles.profile}>
                <Avatar source={author.photoURL && { uri: author.photoURL }} />
                <View style={styles.profileInfo}>
                  <Text style={styles.displayName}>{author.displayName}</Text>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.text.secondary} />
                  ) : (
                    <Text style={styles.role}>
                      {role === "trainer" ? "트레이너" : "회원"}
                    </Text>
                  )}
                </View>
              </View>
              {isMyComment && (
                <Pressable hitSlop={8} onPress={onPressMore}>
                  <MaterialIcons name="more-vert" size={20} color={colors.text.secondary} />
                </Pressable>
              )}
            </View>
            <View style={styles.contentContainer}>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  cardContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  separator: {
    backgroundColor: colors.border.main,
    height: 1,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileInfo: {
    marginLeft: 12,
  },
  displayName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.primary,
  },
  role: {
    color: colors.text.secondary,
    fontSize: 14,
    fontFamily: 'Cafe24SsurroundAir',
  },
  contentContainer: {
    marginTop: 8,
  },
  content: {
    fontSize: 16,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.secondary,
  },
  sub: {
    paddingLeft: 20,
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: colors.border.main,
  },
});

export default CommentCard;