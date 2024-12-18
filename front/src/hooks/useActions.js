import { useActionSheet } from "@expo/react-native-action-sheet";
import { useNavigation } from "@react-navigation/native";

import { removePost } from "../lib/posts";
import { removeComment, removeSubComment } from "../lib/comments";
import { removeFoods } from "../lib/foods";

export default function useActions({ id, content, postId, parentId, foods }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();

  const edit = () => {
    navigation.navigate("Modify", { id, content, postId, parentId, foods });
  };

  const remove = async () => {
    if (!postId) {
      await removePost(id);
      await removeFoods(id);
    } else if (parentId) {
      await removeSubComment({ postId, commentId: parentId, subCommentId: id });
    } else {
      await removeComment({ postId, commentId: id });
    }
  };

  const onPressMore = () => {
    const options = ["수정", "삭제", "취소"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex === 0) {
          edit();
        } else if (selectedIndex === 1) {
          remove();
        }
      }
    );
  };

  return {
    onPressMore,
  };
}
