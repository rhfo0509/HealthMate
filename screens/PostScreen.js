import React from "react";
import { View, Text, Pressable } from "react-native";
import PostCard from "../components/PostCard";
import { useRoute } from "@react-navigation/native";
import CommentModal from "../components/CommentModal";

function PostScreen() {
  const route = useRoute();
  const { user, photoURL, description, createdAt, id } = route.params;
  return (
    <>
      <PostCard
        createdAt={createdAt}
        description={description}
        id={id}
        user={user}
        photoURL={photoURL}
        isDetailMode={true}
      />
    </>
  );
}

export default PostScreen;
