import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView,
  useWindowDimensions,
  Keyboard,
  Animated,
  Pressable,
} from "react-native";
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
import { MaterialIcons } from "@expo/vector-icons";
import FoodInput from "../components/FoodInput"; // 불러오기

function DietPostScreen() {
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
  const [foods, setFoods] = useState([]);

  const handleInputChange = (index, field, value) => {
    const newFoods = [...foods];
    newFoods[index][field] =
      field === "name" ? value : value.replace(/[^0-9.]/g, "");
    setFoods(newFoods);
  };

  const addFood = () => {
    setFoods([
      ...foods,
      { name: "", calories: "", carbs: "", protein: "", fat: "" },
    ]);
  };

  const removeFood = (index) => {
    const newFoods = [...foods];
    newFoods.splice(index, 1);
    setFoods(newFoods);
  };

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

  const handleCreatePost = async (URL) => {
    const newPost = {
      author,
      URL,
      content,
      relatedUserId,
      postType,
      foods,
    };

    await createPost(newPost);
    setIsUploading(false);
    navigation.pop();
  };

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
  }, [result, author, content, foods]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isUploading ? null : <IconRightButton onPress={onSubmit} name="send" />,
    });
  }, [navigation, onSubmit, isUploading]);

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          placeholder="식단 기록을 작성해주세요."
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />

        {/* 여러 음식 입력 */}
        {foods.map((food, index) => (
          <FoodInput
            key={index}
            food={food}
            onChange={(field, value) => handleInputChange(index, field, value)}
            onRemove={() => removeFood(index)}
          />
        ))}

        <Pressable style={styles.addButton} onPress={addFood}>
          <MaterialIcons name="add-circle-outline" size={24} color="blue" />
          <Text style={styles.addText}>음식 추가</Text>
        </Pressable>

        <View style={{ height: 80 }} />
      </ScrollView>
      <CameraButton relatedUserId={relatedUserId} postType={postType} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  addText: {
    marginLeft: 5,
    color: "blue",
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
