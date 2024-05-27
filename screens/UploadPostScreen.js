import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  useWindowDimensions,
  Animated,
  Keyboard,
} from "react-native";
import { ButtonGroup } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import IconRightButton from "../components/IconRightButton";
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

function UploadPostScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { result } = route.params || {};
  const { relatedUserId, postType } = route.params || "";
  const { width } = useWindowDimensions();
  const animation = useRef(new Animated.Value(width)).current;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [content, setContent] = useState("");
  const { user: author } = useUserContext();
  const storage = getStorage();

  const buttons = ["아침", "점심", "저녁", "간식"];

  const onSubmit = useCallback(async () => {
    navigation.pop();
    let URL = null;

    // 사진 없이 글만 등록한 경우
    if (!result) {
      if (postType === "Diet") {
        createPost({
          author,
          URL,
          content,
          relatedUserId,
          postType,
          dietType: buttons[selectedIndex],
        });
      } else {
        createPost({ author, URL, content, relatedUserId, postType });
      }
      return;
    }

    // 사진이나 동영상과 함께 등록한 경우
    const asset = result.assets[0];
    const extension = asset.uri.split(".").pop();
    const storageRef = ref(storage, `/asset/${author.id}/${v4()}.${extension}`);
    const post = await fetch(asset.uri);
    const postBlob = await post.blob();
    await uploadBytesResumable(storageRef, postBlob).then(async () => {
      URL = await getDownloadURL(storageRef);
      if (postType === "Diet") {
        createPost({
          author,
          URL,
          content,
          relatedUserId,
          postType,
          dietType: buttons[selectedIndex],
        });
      } else {
        createPost({ author, URL, content, relatedUserId, postType });
      }
    });
  }, [result, author, content, navigation]);
  useEffect(() => {
    const didShow = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardOpen(true);
    });
    const didHide = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardOpen(false);
    });
    return () => {
      didShow.remove();
      didHide.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isKeyboardOpen ? 0 : width,
      useNativeDriver: false,
      duration: 150,
      delay: 100,
    }).start();
  }, [isKeyboardOpen, width, animation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="send" />,
    });
  }, [navigation, onSubmit]);

  return (
    <View style={styles.block}>
      {postType === "Diet" && (
        <ButtonGroup
          onPress={setSelectedIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
        />
      )}
      {result && (
        <Animated.Image
          source={{ uri: result.assets[0]?.uri }}
          style={[styles.image, { height: animation }]}
          resizeMode="cover"
        />
      )}
      <TextInput
        style={styles.input}
        multiline={true}
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
  block: {
    flex: 1,
  },
  image: {
    width: "100%",
  },
  input: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flex: 1,
    fontSize: 16,
  },
});

export default UploadPostScreen;
