import { useActionSheet } from "@expo/react-native-action-sheet";
import { removePost } from "../lib/posts";
import { useNavigation, useRoute } from "@react-navigation/native";
import { removeComment } from "../lib/comments";

export default function useActions({ id, content, type }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();

  const edit = () => {
    navigation.navigate("Modify", { id, content, type });
  };
  const remove = () => {
    if (type === "Post") {
      removePost(id);
    } else {
      removeComment(id);
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
