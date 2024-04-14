import React, { useState } from "react";
import { View, StyleSheet, Modal, TextInput } from "react-native";
import { useUserContext } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import { createComment } from "../lib/comments";

function CommentModal({ showModal, setShowModal, postId }) {
  const navigation = useNavigation();
  const { user } = useUserContext();
  const [content, setContent] = useState("");
  const onSubmit = async (content) => {
    setShowModal(false);
    await createComment({ content, user, postId });
  };

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="fade"
      onRequestClose={() => {
        setShowModal(false);
        setContent("");
      }}
    >
      <View style={styles.container}>
        <View style={[styles.whiteBox, { paddingBottom: 24 }]}>
          <TextInput
            style={styles.input}
            autoFocus
            returnKeyType="send"
            value={content}
            onChangeText={setContent}
            onSubmitEditing={() => {
              onSubmit(content);
              setContent("");
            }}
            placeholder="댓글을 입력하세요."
            textAlignVertical="top"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  whiteBox: {
    backgroundColor: "white",
    paddingTop: 24,
    paddingHorizontal: 16,
    width: "100%",
  },
  input: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 8,
    height: 120,
    fontSize: 16,
    borderColor: "#ababab",
    borderWidth: 1,
    borderRadius: 4,
  },
});

export default CommentModal;
