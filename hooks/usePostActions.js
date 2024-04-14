import { useActionSheet } from "@expo/react-native-action-sheet";
import { removePost } from "../lib/posts";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function usePostActions({ id, content }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();
  const route = useRoute();

  const edit = () => {
    navigation.navigate("Modify", { id, content });
  };
  const remove = () => {
    removePost(id);

    // 현재 단일 포스트 조회 화면이라면 뒤로가기
    if (route.name === "Post") {
      navigation.pop();
    }

    // TODO: 홈 및 프로필 화면의 목록 업데이트
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
