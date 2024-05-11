import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const imagePickerOption = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  maxWidth: 768,
  maxHeight: 768,
};

function CameraButton({ memberId, postType }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();

  const onPickImage = async (result) => {
    if (result.canceled || !result) {
      return;
    }
    navigation.navigate("UploadPost", { result, memberId, postType });
  };

  const onLaunchCamera = async () => {
    const result = await ImagePicker.launchCameraAsync(imagePickerOption);
    onPickImage(result);
  };

  const onLaunchImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(imagePickerOption);
    onPickImage(result);
  };

  const onPress = () => {
    const options = ["카메라로 촬영하기", "사진 선택하기", "취소"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        title: "사진 업로드",
        options,
        cancelButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex === 0) {
          onLaunchCamera();
        } else if (selectedIndex === 1) {
          onLaunchImageLibrary();
        }
      }
    );
  };
  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.circle} onPress={onPress}>
        <MaterialIcons name="camera-alt" size={24} color="white" />
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
    backgroundColor: "royalblue",
    borderRadius: 27,
    height: 54,
    width: 54,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CameraButton;
