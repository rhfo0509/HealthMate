import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { colors } from "../styles/theme";
const FoodSearchScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { index, foodName, postType, relatedUserId, result, postId } =
    route.params;

  const [foods, setFoods] = useState([]); // 검색된 음식 데이터를 저장
  const [startIndex, setStartIndex] = useState(0); // 페이지네이션을 위한 시작 인덱스
  const [selectedFood, setSelectedFood] = useState(null); // 선택된 음식 항목
  const [servingAmount, setServingAmount] = useState("1"); // 섭취량 (기본값 1)
  const [customAmount, setCustomAmount] = useState(""); // 사용자가 직접 입력한 섭취량
  const [isCustomInputActive, setIsCustomInputActive] = useState(false); // 섭취량 직접 입력 활성화 여부
  const [loading, setLoading] = useState(true);

  // 음식 데이터 load
  useEffect(() => {
    const loadFoodData = async () => {
      try {
        // 음식 JSON 데이터를 가져와 필터링
        const response = require("../assets/food.json");
        const filteredFoods = response.filter((food) =>
          food.DESC_KOR.includes(foodName)
        );

        // 검색된 음식 데이터를 우선순위에 따라 정렬
        const sortedFoods = filteredFoods.sort((a, b) => {
          const aExact = a.DESC_KOR === foodName;
          const bExact = b.DESC_KOR === foodName;
          const aEndsWith = a.DESC_KOR.endsWith(foodName);
          const bEndsWith = b.DESC_KOR.endsWith(foodName);

          return aExact === bExact
            ? aEndsWith === bEndsWith
              ? 0
              : aEndsWith
              ? -1
              : 1
            : aExact
            ? -1
            : 1;
        });

        setFoods(sortedFoods);
      } catch (error) {
        console.error("Error loading food data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFoodData();
  }, [foodName]);

  // 음식 선택 핸들러
  const handleFoodSelect = (food) => {
    if (selectedFood === food) {
      setSelectedFood(null);
      setIsCustomInputActive(false);
    } else {
      setSelectedFood(food);
      setServingAmount("1");
      setCustomAmount("");
      setIsCustomInputActive(false);
    }
  };

  // 음식 등록 핸들러
  const handleRegister = () => {
    if (selectedFood) {
      const servingSize = parseFloat(servingAmount);
      const selectedFoodData = {
        name: selectedFood.DESC_KOR,
        calories: (
          (selectedFood.NUTR_CONT1 * selectedFood.SERVING_SIZE * servingSize) /
          100
        ).toFixed(2),
        carbs: (
          (selectedFood.NUTR_CONT2 * selectedFood.SERVING_SIZE * servingSize) /
          100
        ).toFixed(2),
        protein: (
          (selectedFood.NUTR_CONT3 * selectedFood.SERVING_SIZE * servingSize) /
          100
        ).toFixed(2),
        fat: (
          (selectedFood.NUTR_CONT4 * selectedFood.SERVING_SIZE * servingSize) /
          100
        ).toFixed(2),
      };

      if (postId) {
        // 기존 게시글을 수정하는 경우
        navigation.navigate("Modify", {
          selectedFood: selectedFoodData,
          index,
          id: postId,
        });
      } else {
        // 새로운 게시글인 경우
        navigation.navigate("DietPost", {
          selectedFood: selectedFoodData,
          index,
          postType,
          relatedUserId,
          result,
        });
      }
    }
  };

  // 다음 페이지 로드
  const loadNextPage = () => {
    setSelectedFood(null);
    setStartIndex((prevIndex) => prevIndex + 10);
  };

  // 이전 페이지 로드
  const loadPreviousPage = () => {
    setSelectedFood(null);
    setStartIndex((prevIndex) => Math.max(prevIndex - 10, 0));
  };

  const isAtStart = startIndex === 0; // 첫 페이지 여부
  const isAtEnd = startIndex + 10 >= foods.length; // 마지막 페이지 여부

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  // 검색 결과가 없는 경우
  if (!loading && foods.length === 0) {
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={foods.slice(startIndex, startIndex + 10)}
        keyExtractor={(item) => item.FOOD_CD}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.foodItem,
              selectedFood === item && styles.selectedFoodItem,
            ]}
            onPress={() => handleFoodSelect(item)}
          >
            <View style={styles.foodRow}>
              <Text style={styles.foodName} numberOfLines={1}>
                {item.DESC_KOR}
              </Text>
              <Text style={styles.servingSize}>({item.SERVING_SIZE}g/ml)</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.foodDetails}>
                칼로리:{" "}
                {((item.NUTR_CONT1 * item.SERVING_SIZE) / 100).toFixed(2)} kcal
              </Text>
              <Text style={styles.foodDetails}>
                탄수화물:{" "}
                {((item.NUTR_CONT2 * item.SERVING_SIZE) / 100).toFixed(2)} g
              </Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.foodDetails}>
                단백질:{" "}
                {((item.NUTR_CONT3 * item.SERVING_SIZE) / 100).toFixed(2)} g
              </Text>
              <Text style={styles.foodDetails}>
                지방: {((item.NUTR_CONT4 * item.SERVING_SIZE) / 100).toFixed(2)}{" "}
                g
              </Text>
            </View>
          </Pressable>
        )}
      />
      {/* 선택된 음식에 대해 섭취량 입력 */}
      {selectedFood && (
        <View style={styles.servingContainer}>
          <Text style={styles.servingLabel}>섭취량</Text>
          <View style={styles.buttonGroup}>
            <Pressable
              onPress={() => {
                setServingAmount("0.33");
                setIsCustomInputActive(false);
              }}
              style={[
                styles.servingButton,
                servingAmount === "0.33" &&
                  !isCustomInputActive &&
                  styles.activeButton,
              ]}
            >
              <Text style={styles.buttonText}>1/3</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setServingAmount("0.5");
                setIsCustomInputActive(false);
              }}
              style={[
                styles.servingButton,
                servingAmount === "0.5" &&
                  !isCustomInputActive &&
                  styles.activeButton,
              ]}
            >
              <Text style={styles.buttonText}>1/2</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setServingAmount("1");
                setIsCustomInputActive(false);
              }}
              style={[
                styles.servingButton,
                servingAmount === "1" &&
                  !isCustomInputActive &&
                  styles.activeButton,
              ]}
            >
              <Text style={styles.buttonText}>1</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setIsCustomInputActive(true);
                setServingAmount("");
              }}
              style={[
                styles.customButton,
                isCustomInputActive && styles.activeButton,
              ]}
            >
              <Text style={styles.buttonText}>직접 입력</Text>
            </Pressable>
          </View>
          {isCustomInputActive && (
            <View style={styles.customInputContainer}>
              <TextInput
                value={customAmount}
                onChangeText={(value) => {
                  const regex = /^[1-9][0-9]*$/;
                  if (regex.test(value) || value === "") {
                    setCustomAmount(value);
                    setServingAmount(value / selectedFood.SERVING_SIZE);
                  }
                }}
                placeholder="섭취량 입력"
                keyboardType="numeric"
                style={styles.customInput}
              />
              <Text style={styles.unitText}>(g/ml)</Text>
            </View>
          )}
          <Pressable onPress={handleRegister} style={styles.registerButton}>
            <Text style={[styles.buttonText, { color: colors.primary[500] }]}>등록</Text>
          </Pressable>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.previousButton, isAtStart && styles.disabledButton]}
          onPress={isAtStart ? null : loadPreviousPage}
          disabled={isAtStart}
        >
          <Text style={styles.buttonText}>이전 검색</Text>
        </Pressable>
        <Pressable
          style={[styles.nextButton, isAtEnd && styles.disabledButton]}
          onPress={isAtEnd ? null : loadNextPage}
          disabled={isAtEnd}
        >
          <Text style={styles.buttonText}>다음 검색</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.surface,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.primary,
  },
  foodItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.dark,
  },
  selectedFoodItem: {
    backgroundColor: colors.gray[100],
  },
  foodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Cafe24SsurroundAir',
  },
  servingSize: {
    fontSize: 14,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.secondary,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  foodDetails: {
    fontSize: 14,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.primary,
  },
  servingContainer: {
    padding: 12,
    backgroundColor: colors.surface,
  },
  servingLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Cafe24SsurroundAir',
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  servingButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.dark,
    marginHorizontal: 2,
    borderRadius: 4,
    backgroundColor: colors.text.primary,
  },
  activeButton: {
    opacity: 0.5,
  },
  customButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
    backgroundColor: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.dark,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  customInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border.dark,
    padding: 8,
    borderRadius: 4,
  },
  unitText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.text.primary,
  },
  registerButton: {
    backgroundColor: colors.surface,
    padding: 8,
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary[500],
    marginTop: 8,
    marginHorizontal: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  previousButton: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    borderRadius: 4,
    marginRight: 4,
  },
  nextButton: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    borderRadius: 4,
    marginLeft: 4,
  },
  disabledButton: {
    backgroundColor: colors.border.dark,
  },
  buttonText: {
    color: colors.background,
    fontSize: 14,
    fontFamily: 'Cafe24SsurroundAir',
  },
});

export default FoodSearchScreen;
