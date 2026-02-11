import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  useWindowDimensions,
  Animated,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { v4 } from "uuid";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { Image, Video } from "react-native-compressor";
import { colors } from "../styles/theme";

import { createPost } from "../lib/posts";
import { useUserContext } from "../contexts/UserContext";
import CameraButton from "../components/CameraButton";
import ProgressBar from "../components/ProgressBar";
import IconRightButton from "../components/IconRightButton";

function ExercisePostScreen() {
  const { width } = useWindowDimensions();
  const { result } = useRoute().params || {};
  const { relatedUserId, postType } = useRoute().params || {};
  const { user: author } = useUserContext();
  const navigation = useNavigation();

  const animation = useRef(new Animated.Value(width)).current;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [content, setContent] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // 업로드 중 처리
  const handleUpload = async (uri, storageRef) => {
    try {
      const post = await fetch(uri);
      const postBlob = await post.blob();
      const uploadTask = uploadBytesResumable(storageRef, postBlob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            console.error("Upload failed:", error);
            setIsUploading(false);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Network request failed:", error);
      throw new Error("File upload failed due to network issues.");
    }
  };

  // 포스트 생성
  const handleCreatePost = async (URL) => {
    const newPost = {
      author,
      URL,
      content,
      relatedUserId,
      postType,
    };

    await createPost(newPost);
    setIsUploading(false);
    navigation.pop();
  };

  // 제출 처리
  const onSubmit = useCallback(async () => {
    setIsUploading(true);

    let URL = null;
    if (result) {
      const asset = result.assets[0];
      const extension = asset.uri.split(".").pop();
      const storageRef = ref(
        getStorage(),
        `/asset/${author.id}/${v4()}.${extension}`
      );

      let compressedUri = null;
      if (asset.type === "video") {
        compressedUri = await Video.compress(asset.uri);
      } else if (asset.type === "image") {
        compressedUri = await Image.compress(asset.uri);
      }

      if (compressedUri) {
        URL = await handleUpload(compressedUri, storageRef);
      }
    }

    await handleCreatePost(URL);
  }, [result, author, content]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () =>
      setIsKeyboardOpen(true)
    );
    const hideListener = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardOpen(false)
    );
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isKeyboardOpen ? 0 : width,
      useNativeDriver: false,
      duration: 150,
    }).start();
  }, [isKeyboardOpen, width]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isUploading ? null : <IconRightButton onPress={onSubmit} name="send" />,
    });
  }, [navigation, onSubmit, isUploading]);

  // 업로드 중 화면
  if (isUploading) {
    return (
      <View style={styles.uploading}>
        <ProgressBar totalStep={100} currStep={progress} />
        <Text style={styles.uploadingText}>업로드 중입니다...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {result && (
        <Animated.Image
          source={{ uri: result.assets[0]?.uri }}
          style={[styles.image, { height: animation }]}
          resizeMode="cover"
        />
      )}
      <TextInput
        style={styles.input}
        multiline
        placeholder="운동 기록을 작성해주세요."
        textAlignVertical="top"
        value={content}
        onChangeText={setContent}
      />
      <CameraButton relatedUserId={relatedUserId} postType={postType} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  image: {
    width: "100%",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flex: 1,
    fontSize: 16,
  },
  uploading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingText: {
    marginTop: 10,
    fontSize: 18,
    color: colors.text.primary,
  },
});

export default ExercisePostScreen;