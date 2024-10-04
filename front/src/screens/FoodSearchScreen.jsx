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

const FoodSearchScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { index, foodName, postType, relatedUserId, result } = route.params;

  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingAmount, setServingAmount] = useState("1");
  const [customAmount, setCustomAmount] = useState("");
  const [isCustomInputActive, setIsCustomInputActive] = useState(false);

  useEffect(() => {
    const loadFoodData = async () => {
      try {
        const response = require("../assets/food.json");
        const filteredFoods = response.filter((food) =>
          food.DESC_KOR.includes(foodName)
        );

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

      navigation.navigate("DietPost", {
        selectedFood: selectedFoodData,
        index,
        postType,
        relatedUserId,
        result,
      });
    }
  };

  const loadNextPage = () => {
    setStartIndex((prevIndex) => prevIndex + 10);
  };

  const loadPreviousPage = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 10, 0));
  };

  const isAtStart = startIndex === 0;
  const isAtEnd = startIndex + 10 >= foods.length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="royalblue" />
      </View>
    );
  }

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
            <Text style={styles.buttonText}>등록</Text>
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
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 18,
    color: "#333",
  },
  foodItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedFoodItem: {
    backgroundColor: "#f0f0f0",
  },
  foodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  servingSize: {
    fontSize: 14,
    color: "#666",
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  foodDetails: {
    fontSize: 14,
    color: "#333",
  },
  servingContainer: {
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  servingLabel: {
    fontSize: 16,
    fontWeight: "500",
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
    borderColor: "#ccc",
    marginHorizontal: 2,
    borderRadius: 4,
    backgroundColor: "#333",
  },
  activeButton: {
    opacity: 0.5,
  },
  customButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
    backgroundColor: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
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
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
  unitText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  registerButton: {
    backgroundColor: "royalblue",
    padding: 12,
    alignItems: "center",
    borderRadius: 4,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  previousButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "royalblue",
    alignItems: "center",
    borderRadius: 4,
    marginRight: 4,
  },
  nextButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "royalblue",
    alignItems: "center",
    borderRadius: 4,
    marginLeft: 4,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default FoodSearchScreen;
