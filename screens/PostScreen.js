import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import PostCard from "../components/PostCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import CommentModal from "../components/CommentModal";
import CommentCard from "../components/CommentCard";
import IconRightButton from "../components/IconRightButton";
import { getComments } from "../lib/comments";
import { FlatList } from "react-native-gesture-handler";

function PostScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const { user, photoURL, content, createdAt, id } = route.params;

  useEffect(() => {
    getComments(id).then(setComments);
  }, [showModal]);

  const onPress = () => {
    setShowModal(true);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconRightButton onPress={onPress} name="add-comment" />
      ),
    });
  }, [navigation, onPress]);

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
      <CommentModal
        // handleClose={handleClose}
        showModal={showModal}
        setShowModal={setShowModal}
        postId={id}
        // handleSave={handleSave}
      />
    </View>
  );
}

const renderItem = ({ item }) => (
  <CommentCard
    createdAt={item.createdAt}
    content={item.content}
    id={item.id}
    user={item.user}
  />
);

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
