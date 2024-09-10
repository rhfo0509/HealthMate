import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
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
import { getRole } from "../lib/users";

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
        style={{ backgroundColor: "white" }}
        data={subcomments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <Pressable
            style={[styles.cardContent, parentId ? styles.sub : null]}
            android_ripple={{ color: "#ededed" }}
            onPress={onPress}
            disabled={parentId ? true : false}
          >
            <View style={styles.header}>
              <View style={styles.profile}>
                <Avatar source={author.photoURL && { uri: author.photoURL }} />
                <View style={styles.profileInfo}>
                  <Text style={styles.displayName}>{author.displayName}</Text>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#757575" />
                  ) : (
                    <Text style={styles.role}>
                      {role === "trainer" ? "트레이너" : "회원"}
                    </Text>
                  )}
                </View>
              </View>
              {isMyComment && (
                <Pressable hitSlop={8} onPress={onPressMore}>
                  <MaterialIcons name="more-vert" size={20} color="#757575" />
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
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
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
    backgroundColor: "#e0e0e0",
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
    fontWeight: "bold",
    color: "#333",
  },
  role: {
    color: "#757575",
    fontSize: 14,
  },
  contentContainer: {
    marginTop: 8,
  },
  content: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: "#757575",
  },
  sub: {
    paddingLeft: 20,
    backgroundColor: "#f9f9f9",
    borderLeftWidth: 4,
    borderLeftColor: "#e0e0e0",
  },
});

export default CommentCard;
