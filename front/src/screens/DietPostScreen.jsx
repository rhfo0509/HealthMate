import React, { useState, useCallback, useEffect, useRef } from "react";
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
  Alert,
} from "react-native";
import { ButtonGroup } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import { MaterialIcons } from "@expo/vector-icons";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { Image, Video } from "react-native-compressor";
import { createPost } from "../lib/posts";
import { createFoods } from "../lib/foods";
import { useUserContext } from "../contexts/UserContext";
import CameraButton from "../components/CameraButton";
import ProgressBar from "../components/ProgressBar";
import IconRightButton from "../components/IconRightButton";
import FoodInput from "../components/FoodInput";

function DietPostScreen() {
  const { width } = useWindowDimensions();
  const {
    result,
    selectedFood,
    index: selectedFoodIndex,
    postType,
    relatedUserId,
  } = useRoute().params || {};
  const { user: author } = useUserContext();
  const navigation = useNavigation();

  const animation = useRef(new Animated.Value(width)).current;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [foods, setFoods] = useState([]);

  const buttons = ["아침", "점심", "저녁", "간식"];

  // 음식 검색 화면으로 이동
  const handleSearchFood = (index, foodName) => {
    if (!foodName) {
      Alert.alert("알림", "음식명을 입력해주세요.");
      return;
    }

    navigation.navigate("FoodSearch", {
      index,
      foodName,
      postType,
      relatedUserId,
      result,
    });
  };

  // 선택된 음식 정보 반영
  useEffect(() => {
    if (selectedFood && typeof selectedFoodIndex === "number") {
      const updatedFoods = [...foods];
      updatedFoods[selectedFoodIndex] = {
        name: selectedFood.name,
        calories: selectedFood.calories,
        carbs: selectedFood.carbs,
        protein: selectedFood.protein,
        fat: selectedFood.fat,
      };
      setFoods(updatedFoods);
    }
  }, [selectedFood, selectedFoodIndex]);

  // 음식 입력 핸들러
  const handleInputChange = (index, field, value) => {
    const updatedFoods = [...foods];
    updatedFoods[index][field] =
      field === "name" ? value : value.replace(/[^0-9.]/g, "");
    setFoods(updatedFoods);
  };

  // 음식 추가
  const addFood = () => {
    setFoods([
      ...foods,
      { name: "", calories: "", carbs: "", protein: "", fat: "" },
    ]);
  };

  // 음식 제거
  const removeFood = (index) => {
    setFoods(foods.filter((_, i) => i !== index));
  };

  // 파일 업로드 처리
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
      console.error("Network request failed", error);
      throw new Error("File upload failed due to network issues.");
    }
  };

  // 게시글 생성 및 업로드
  const handleCreatePost = async (URL) => {
    const newPost = {
      author,
      URL,
      content,
      relatedUserId,
      postType,
      dietType: buttons[selectedIndex],
    };

    const postRef = await createPost(newPost);

    if (foods.length > 0) {
      const newFoods = {
        userId: author.id,
        relatedUserId,
        postId: postRef.id,
        foods,
      };
      await createFoods(newFoods);
    }

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
        `/asset/${author.id}/${uuidv4()}.${extension}`
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
  }, [result, author, content, foods, selectedIndex]);

  // 키보드 이벤트 처리 및 애니메이션
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

  // 내비게이션 옵션 설정
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        !isUploading ? (
          <IconRightButton onPress={onSubmit} name="send" />
        ) : null,
    });
  }, [navigation, onSubmit, isUploading]);

  // 업로드 중 표시
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
      <ScrollView>
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
          placeholder="식단 기록을 작성해주세요."
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />

        {foods.map((food, index) => (
          <FoodInput
            key={index}
            food={food}
            onChange={(field, value) => handleInputChange(index, field, value)}
            onRemove={() => removeFood(index)}
            onSearch={() => handleSearchFood(index, food.name)}
          />
        ))}

        <Pressable style={styles.addButton} onPress={addFood}>
          <MaterialIcons name="add-circle-outline" size={24} color="#1f6feb" />
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
    color: "#1f6feb",
    fontSize: 16,
    marginTop: 1,
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
