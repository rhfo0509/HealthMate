import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text, Image, Pressable, Modal } from "react-native";
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
  postType,
  dietType,
}) {
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
      dietType,
      isDetailMode: true,
    });
  };

  const { onPressMore } = useActions({ id, content });

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
      <Pressable
        style={
          !isDetailMode && {
            flexDirection: "row",
          }
        }
        onPress={onPressPost}
        disabled={isDetailMode}
      >
        {isVideoURL(URL) ? (
          <VideoView URL={URL} />
        ) : URL ? (
          <View>
            <Pressable onPress={() => setShow(true)} disabled={!isDetailMode}>
              <Image
                source={{ uri: URL }}
                style={[
                  styles.image,
                  isDetailMode && {
                    width: "100%",
                    aspectRatio: "16 / 9",
                    marginLeft: 0,
                  },
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
        <View style={[styles.paddingBlock]}>
          {postType === "Diet" && (
            <View
              style={{
                paddingVertical: 5,
                paddingHorizontal: 50,
                backgroundColor: "skyblue",
                borderRadius: 5,
                alignSelf: "center",
              }}
            >
              <Text style={{ color: "white" }}>{dietType}</Text>
            </View>
          )}
          <Text style={styles.content} numberOfLines={5} ellipsizeMode="tail">
            {content}
          </Text>
        </View>
      </Pressable>
      <View style={styles.paddingBlock}>
        <Text style={styles.date}>{date.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingVertical: 16,
  },
  paddingBlock: {
    flex: 1,
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
    width: 150,
    aspectRatio: 1 / 1,
    marginLeft: 16,
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
