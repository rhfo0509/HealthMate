import React, { useMemo } from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import Avatar from "./Avatar";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import usePostActions from "../hooks/usePostActions";

function PostCard({ user, photoURL, description, createdAt, id }) {
  const routeNames = useNavigationState((state) => state.routeNames);
  // routeNames 배열에 "MyProfile"이 있을 경우 사용자 정보를 눌렀을 때 내 프로필 화면으로 이동
  const navigation = useNavigation();
  const date = useMemo(
    () => (createdAt ? new Date(createdAt.seconds * 1000) : new Date()),
    [createdAt]
  );
  const { user: me } = useUserContext();
  const isMyPost = me.id === user.id;

  const onOpenProfile = () => {
    // 아래와 같이 수정
    if (routeNames.find((routeName) => routeName === "MyProfile")) {
      navigation.navigate("MyProfile");
    } else {
      navigation.navigate("Profile", {
        userId: user.id,
        displayName: user.displayName,
      });
    }
  };

  const { onPressMore } = usePostActions({ id, description });

  return (
    <View style={styles.block}>
      <View style={[styles.head, styles.paddingBlock]}>
        <Pressable style={styles.profile} onPress={onOpenProfile}>
          <Avatar source={user.photoURL && { uri: user.photoURL }} />
          <Text style={styles.displayName}>{user.displayName}</Text>
        </Pressable>
        {isMyPost && (
          <Pressable hitSlop={8} onPress={onPressMore}>
            <MaterialIcons name="more-vert" size={20} />
          </Pressable>
        )}
      </View>
      {photoURL && (
        <Image
          source={{ uri: photoURL }}
          style={styles.image}
          resizeMethod="resize"
          resizeMode="cover"
        />
      )}
      <View style={styles.paddingBlock}>
        <Text style={styles.description}>{description}</Text>
        <Text date={date} style={styles.date}>
          {date.toLocaleString()}
        </Text>
      </View>
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
    backgroundColor: "#bdbdbd",
    width: "100%",
    aspectRatio: 1,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  date: {
    color: "#757575",
    fontSize: 12,
    lineHeight: 18,
  },
});

export default PostCard;
