import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import IconRightButton from "../components/IconRightButton";
import { useUserContext } from "../contexts/UserContext";
import { createComment, createSubComment } from "../lib/comments";

function CommentScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId, commentId } = route.params;
  const [content, setContent] = useState("");
  const { user: author } = useUserContext();

  const onSubmit = useCallback(async () => {
    navigation.pop();

    // 댓글을 등록한 경우
    if (!commentId) {
      createComment({ content, author, postId });
      return;
    }

    // 대댓글을 등록한 경우
    createSubComment({ content, author, postId, commentId });
  }, [postId, commentId, author, content, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="send" />,
    });
  }, [navigation, onSubmit]);

  return (
    <View style={styles.block}>
      <TextInput
        style={styles.input}
        multiline={true}
        placeholder="댓글을 입력하세요..."
        textAlignVertical="top"
        value={content}
        onChangeText={setContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  input: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flex: 1,
    fontSize: 16,
  },
});

export default CommentScreen;
