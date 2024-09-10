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
import { ButtonGroup } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import { v4 } from "uuid";
import { createPost } from "../lib/posts";
import { useUserContext } from "../contexts/UserContext";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import CameraButton from "../components/CameraButton";
import ProgressBar from "../components/ProgressBar";
import IconRightButton from "../components/IconRightButton";

function DietPostScreen() {
  const { width } = useWindowDimensions();
  const { result } = useRoute().params || {};
  const { relatedUserId, postType } = useRoute().params || {};
  const { user: author } = useUserContext();
  const navigation = useNavigation();

  const animation = useRef(new Animated.Value(width)).current;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const buttons = ["아침", "점심", "저녁", "간식"];

  // 업로드 중 처리
  const handleUpload = async (asset, storageRef) => {
    const post = await fetch(asset.uri);
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
          console.error(error);
          setIsUploading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // 포스트 생성
  const handleCreatePost = async (URL) => {
    const newPost = {
      author,
      URL,
      content,
      relatedUserId,
      postType,
      dietType: buttons[selectedIndex],
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
      URL = await handleUpload(asset, storageRef);
    }

    await handleCreatePost(URL);
  }, [result, author, content, selectedIndex]);

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
      <View style={styles.uploadingContainer}>
        <ProgressBar totalStep={100} currStep={progress} />
        <Text style={styles.uploadingText}>업로드 중입니다...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ButtonGroup
        onPress={setSelectedIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
      />
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
        placeholder="게시글을 작성해주세요."
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
  uploadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
});

export default DietPostScreen;
