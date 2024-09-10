import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import Avatar from "./Avatar";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import useActions from "../hooks/useActions";
import VideoView from "./VideoView";
import { getRole } from "../lib/users";

function PostCard({
  author,
  URL,
  content,
  createdAt,
  id,
  isDetailMode,
  dietType,
}) {
  const navigation = useNavigation();
  const date = useMemo(
    () =>
      createdAt ? new Date(createdAt.seconds * 1000).toLocaleString() : "",
    [createdAt]
  );
  const { user } = useUserContext();
  const isMyPost = user.id === author.id;
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);

  const onPressPost = () => {
    navigation.navigate("Post", {
      author,
      URL,
      content,
      createdAt,
      id,
      dietType,
      isDetailMode: true,
    });
  };

  const { onPressMore } = useActions({ id, content });

  const isVideo = (URL) => /\.(mp4|mov|avi)/i.test(URL);

  useEffect(() => {
    const fetchRole = async () => {
      setIsLoading(true);
      const result = await getRole(author.id);
      setRole(result);
      setIsLoading(false);
    };

    fetchRole();
  }, [author.id]);

  return (
    <View style={styles.card}>
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
        {isMyPost && (
          <Pressable hitSlop={8} onPress={onPressMore}>
            <MaterialIcons name="more-vert" size={24} color="#757575" />
          </Pressable>
        )}
      </View>
      <Pressable
        style={[
          styles.contentContainer,
          isDetailMode && { flexDirection: "column" },
        ]}
        onPress={onPressPost}
        disabled={isDetailMode}
      >
        {isVideo(URL) ? (
          <VideoView URL={URL} isDetailMode={isDetailMode} />
        ) : URL ? (
          <View>
            <Pressable onPress={() => setShow(true)} disabled={!isDetailMode}>
              <Image
                source={{ uri: URL }}
                style={[
                  styles.media,
                  isDetailMode && { width: "100%", aspectRatio: 16 / 9 },
                ]}
              />
            </Pressable>
            <Modal
              visible={show}
              animationType="fade"
              onRequestClose={() => setShow(false)}
            >
              <View style={styles.imageViewer}>
                <Image
                  source={{ uri: URL }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMethod="resize"
                  resizeMode="contain"
                />
              </View>
            </Modal>
          </View>
        ) : null}
        <View
          style={[styles.textContainer, isDetailMode && { paddingLeft: 16 }]}
        >
          <Text
            style={styles.contentText}
            numberOfLines={isDetailMode ? undefined : 7}
            ellipsizeMode={isDetailMode ? undefined : "tail"}
          >
            {content}
          </Text>
        </View>
      </Pressable>
      <View style={styles.footer}>
        <Text style={styles.date}>{date}</Text>
      </View>
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
    marginVertical: 12,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  },
  contentContainer: {
    flexDirection: "row",
  },
  media: {
    width: 180,
    height: 180,
    marginLeft: 16,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
  },
  textContainer: {
    flex: 1,
    paddingLeft: 4,
    paddingRight: 16,
  },
  contentText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  date: {
    fontSize: 12,
    color: "#757575",
  },
  imageViewer: {
    padding: 16,
  },
});

export default PostCard;
