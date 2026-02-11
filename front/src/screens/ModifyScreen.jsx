import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/theme";

import { updatePost } from "../lib/posts";
import { updateComment, updateSubComment } from "../lib/comments";
import { updateFoods } from "../lib/foods";
import IconRightButton from "../components/IconRightButton";
import FoodInput from "../components/FoodInput";

function ModifyScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const inputRef = useRef(null);

  const {
    id,
    content: initialContent,
    foods: initialFoods = [],
    postId,
    parentId,
    selectedFood,
    index: selectedFoodIndex,
  } = params;

  const [content, setContent] = useState(initialContent);
  const [foods, setFoods] = useState(initialFoods);

  // selectedFood 변경 시 해당 음식 데이터로 업데이트
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

  // 음식 데이터 변경 핸들러
  const handleInputChange = (index, field, value) => {
    const updatedFoods = [...foods];
    updatedFoods[index][field] =
      field === "name" ? value : value.replace(/[^0-9.]/g, "");
    setFoods(updatedFoods);
  };

  // 새로운 음식 추가
  const addFood = () => {
    setFoods([
      ...foods,
      { name: "", calories: "", carbs: "", protein: "", fat: "" },
    ]);
  };

  // 음식 삭제
  const removeFood = (index) => {
    setFoods(foods.filter((_, i) => i !== index));
  };

  // 음식 검색 핸들러 -> FoodSearch 화면으로 이동
  const handleSearchFood = (index, foodName) => {
    if (!foodName) {
      Alert.alert("알림", "음식명을 입력해주세요.");
      return;
    }
    navigation.navigate("FoodSearch", {
      index,
      foodName,
      postId: id,
    });
  };

  // 게시글, 댓글, 대댓글 처리
  const onSubmit = useCallback(async () => {
    if (!postId) {
      // 게시글 업데이트
      await updatePost(id, { content });
      // 음식 데이터가 변경된 경우 업데이트
      if (JSON.stringify(initialFoods) !== JSON.stringify(foods)) {
        await updateFoods(id, foods);
      }
    } else if (parentId) {
      // 대댓글 업데이트
      await updateSubComment({
        postId,
        commentId: parentId,
        subCommentId: id,
        content,
      });
    } else {
      // 댓글 업데이트
      await updateComment({
        postId,
        commentId: id,
        content,
      });
    }

    navigation.pop();
  }, [id, content, foods, postId, parentId, initialFoods, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="check" />,
    });
  }, [navigation, onSubmit]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        multiline
        placeholder="글을 입력하세요."
        textAlignVertical="top"
        value={content}
        onChangeText={setContent}
      />
      {foods.length > 0 &&
        foods.map((food, index) => (
          <FoodInput
            key={index}
            food={food}
            onChange={(field, value) => handleInputChange(index, field, value)}
            onRemove={() => removeFood(index)}
            onSearch={() => handleSearchFood(index, food.name)}
          />
        ))}
      {foods.length > 0 && (
        <Pressable style={styles.addButton} onPress={addFood}>
          <MaterialIcons name="add-circle-outline" size={24} color={colors.primary[500]} />
          <Text style={styles.addText}>음식 추가</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  input: {
    padding: 16,
    fontSize: 16,
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  addText: {
    marginLeft: 5,
    color: colors.primary[500],
    fontSize: 16,
    marginTop: 1,
  },
});

export default ModifyScreen;