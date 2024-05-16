import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text, Image, Pressable, Modal } from "react-native";
import Avatar from "./Avatar";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import useActions from "../hooks/useActions";
import VideoView from "./VideoView";
import { getRole } from "../lib/users";

function PostCard({ author, URL, content, createdAt, id, isDetailMode }) {
  const navigation = useNavigation();
  const date = useMemo(
    () => (createdAt ? new Date(createdAt.seconds * 1000) : new Date()),
    [createdAt]
  );
  const { user } = useUserContext();
  const isMyPost = user.id === author.id;
  const [role, setRole] = useState("");
  const [show, setShow] = useState(false);

  const onPressPost = () => {
    navigation.navigate("Post", {
      author,
      URL,
      content,
      createdAt,
      id,
      isDetailMode: true,
    });
  };

  const { onPressMore } = useActions({ id, content });

  const onPressImage = () => {
    setShow(true);
  };

  const isVideoURL = (URL) => {
    return /\.(mp4|mov|avi)/i.test(URL);
  };

  useEffect(() => {
    (async () => {
      const result = await getRole(author.id);
      setRole(result);
    })();
  }, [author.id]);

  return (
    <View style={styles.block}>
      {!isDetailMode && (
        <View style={[styles.head, styles.paddingBlock]}>
          <View style={styles.profile}>
            <Avatar source={author.photoURL && { uri: author.photoURL }} />
            <Text style={styles.displayName}>
              {author.displayName} {role === "trainer" ? "트레이너" : "회원"}
            </Text>
          </View>
          {isMyPost && (
            <Pressable hitSlop={8} onPress={onPressMore}>
              <MaterialIcons name="more-vert" size={20} />
            </Pressable>
          )}
        </View>
      )}
      {URL && isVideoURL(URL) ? (
        <VideoView URL={URL} />
      ) : (
        <View>
          <Pressable onPress={onPressImage}>
            <Image
              source={{ uri: URL }}
              style={styles.image}
              resizeMethod="resize"
              resizeMode="contain"
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
      )}
      <Pressable
        android_ripple={{ color: "#ededed" }}
        onPress={onPressPost}
        disabled={isDetailMode}
      >
        <View style={styles.paddingBlock}>
          <Text style={styles.content}>{content}</Text>
          <Text date={date} style={styles.date}>
            {date.toLocaleString()}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingTop: 16,
    paddingBottom: 16,
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
    width: "100%",
    aspectRatio: 16 / 9,
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
  imageViewer: {
    padding: 16,
  },
});

export default PostCard;
