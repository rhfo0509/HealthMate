import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";

function WriteButton({ postType, relatedUserId }) {
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    if (postType === "Diet") {
      navigation.navigate("DietPost", { postType, relatedUserId });
    } else if (postType === "Exercise") {
      showActionSheetWithOptions(
        {
          options: ["일지 작성하기", "루틴 등록하기", "취소"],
          cancelButtonIndex: 2,
          cancelButtonTintColor: "#d9534f",
        },
        (selectedIndex) => {
          if (selectedIndex === 0) {
            navigation.navigate("ExercisePost", { postType, relatedUserId });
          } else if (selectedIndex === 1) {
            navigation.navigate("Routine", { relatedUserId });
          }
        }
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.circle} onPress={onPress}>
        <MaterialIcons name="add" size={24} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 5,
    borderRadius: 27,
    height: 54,
    width: 54,
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  circle: {
    backgroundColor: "#1f6feb",
    borderRadius: 27,
    height: 54,
    width: 54,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WriteButton;
