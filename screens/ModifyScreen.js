import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import IconRightButton from "../components/IconRightButton";
import { updatePost } from "../lib/posts";
import { updateComment, updateSubComment } from "../lib/comments";

function ModifyScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const inputRef = useRef(null);
  const [content, setContent] = useState(params.content);

  const onSubmit = useCallback(() => {
    if (!params.postId) {
      updatePost({
        id: params.id,
        content,
      });
    } else if (params.parentId) {
      updateSubComment({
        postId: params.postId,
        commentId: params.parentId,
        subCommentId: params.id,
        content,
      });
    } else {
      updateComment({
        postId: params.postId,
        commentId: params.id,
        content,
      });
    }

    // TODO: 포스트 및 포스트 목록 업데이트
    navigation.pop();
  }, [navigation, params.id, content]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="check" />,
    });
  }, [navigation, onSubmit]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <View style={styles.block}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        multiline={true}
        placeholder="글을 입력하세요."
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

export default ModifyScreen;
