import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import IconRightButton from "../components/IconRightButton";
import { updatePost } from "../lib/posts";
import { updateComment, updateSubComment } from "../lib/comments";
import { updateFoods } from "../lib/foods";
import FoodInput from "../components/FoodInput";

function ModifyScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();

  const {
    id,
    content: initialContent,
    foods: initialFoods = [],
    postId,
    parentId,
    selectedFood,
    index: selectedFoodIndex,
  } = params;

  const inputRef = useRef(null);
  const [content, setContent] = useState(initialContent);
  const [foods, setFoods] = useState(initialFoods);

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

  const handleInputChange = (index, field, value) => {
    const updatedFoods = [...foods];
    updatedFoods[index][field] =
      field === "name" ? value : value.replace(/[^0-9.]/g, "");
    setFoods(updatedFoods);
  };

  const addFood = () => {
    setFoods([
      ...foods,
      { name: "", calories: "", carbs: "", protein: "", fat: "" },
    ]);
  };

  const removeFood = (index) => {
    setFoods(foods.filter((_, i) => i !== index));
  };

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

  const onSubmit = useCallback(async () => {
    if (!postId) {
      await updatePost(id, { content });
      if (JSON.stringify(initialFoods) !== JSON.stringify(foods)) {
        await updateFoods(id, foods);
      }
    } else if (parentId) {
      await updateSubComment({
        postId,
        commentId: parentId,
        subCommentId: id,
        content,
      });
    } else {
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
          <MaterialIcons name="add-circle-outline" size={24} color="#1f6feb" />
          <Text style={styles.addText}>음식 추가</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#1f6feb",
    fontSize: 16,
    marginTop: 1,
  },
});

export default ModifyScreen;
