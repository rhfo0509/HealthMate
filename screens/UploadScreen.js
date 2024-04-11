import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  useWindowDimensions,
  Animated,
  Keyboard,
} from "react-native";
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

function UploadScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { result } = route.params || {};
  const { memberId, postType } = route.params || "";
  const { width } = useWindowDimensions();
  const animation = useRef(new Animated.Value(width)).current;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [description, setDescription] = useState("");
  const { user } = useUserContext();
  const storage = getStorage();

  const onSubmit = useCallback(async () => {
    navigation.pop();
    let photoURL = null;

    // 사진 없이 글만 등록한 경우
    if (!result) {
      await createPost({ description, photoURL, user, memberId, postType });
      return;
    }

    // 사진과 함께 등록한 경우
    const asset = result.assets[0];
    const extension = asset.uri.split(".").pop();
    const storageRef = ref(storage, `/photo/${user.id}/${v4()}.${extension}`);
    const post = await fetch(asset.uri);
    const postBlob = await post.blob();
    await uploadBytesResumable(storageRef, postBlob).then(async (snapshot) => {
      photoURL = await getDownloadURL(storageRef);
      await createPost({ description, photoURL, user, memberId, postType });
    });
  }, [result, user, description, navigation]);

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
        placeholder="이 사진에 대한 설명을 입력하세요..."
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />
      <CameraButton memberId={memberId} postType={postType} />
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

export default UploadScreen;
