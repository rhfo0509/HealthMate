import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useUserContext } from "../contexts/UserContext";
import { createComment, createSubComment } from "../lib/comments";
import IconRightButton from "../components/IconRightButton";

function CommentScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId, commentId } = route.params;
  const { user: author } = useUserContext();

  const [content, setContent] = useState("");

  // 댓글, 대댓글 처리
  const onSubmit = useCallback(async () => {
    navigation.pop();

    // 댓글 등록
    if (!commentId) {
      createComment({ content, author, postId });
      return;
    }

    // 대댓글 등록
    createSubComment({ content, author, postId, commentId });
  }, [postId, commentId, author, content, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="send" />,
    });
  }, [navigation, onSubmit]);

  return (
    <View style={styles.container}>
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  input: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flex: 1,
    fontSize: 16,
    fontFamily: 'Cafe24SsurroundAir',
  },
});

export default CommentScreen;
