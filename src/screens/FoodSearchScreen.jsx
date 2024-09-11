import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";

const FoodSearchScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { index, foodName, postType, relatedUserId, result } = route.params;

  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState([]);
  const [startIndex, setStartIndex] = useState(1);

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://openapi.foodsafetykorea.go.kr/api/a788d8670f6a4dcaad36/I2790/json/${startIndex}/${
            startIndex + 9
          }/DESC_KOR=${encodeURIComponent(foodName)}`
        );
        const foodItems = response.data.I2790.row;
        setFoods(foodItems);
      } catch (error) {
        console.error("Error fetching food data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodData();
  }, [foodName, startIndex]);

  const handleFoodSelect = (selectedFood) => {
    navigation.navigate("DietPost", {
      selectedFood: {
        name: selectedFood.DESC_KOR,
        calories: selectedFood.NUTR_CONT1,
        carbs: selectedFood.NUTR_CONT3,
        protein: selectedFood.NUTR_CONT2,
        fat: selectedFood.NUTR_CONT4,
      },
      index,
      postType,
      relatedUserId,
      result,
    });
  };

  const loadNextPage = () => {
    setFoods([]);
    setStartIndex((prevIndex) => prevIndex + 10);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="royalblue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={foods}
        keyExtractor={(item) => item.FOOD_CD}
        renderItem={({ item }) => (
          <Pressable
            style={styles.foodItem}
            onPress={() => handleFoodSelect(item)}
          >
            <View style={styles.foodRow}>
              <Text style={styles.foodName} numberOfLines={1}>
                {item.DESC_KOR}
                {item.MAKER_NAME ? ` (${item.MAKER_NAME})` : ""}
              </Text>
              <Text style={styles.servingSize}>({item.SERVING_SIZE}g/ml)</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.foodDetails}>
                칼로리: {item.NUTR_CONT1} kcal
              </Text>
              <Text style={styles.foodDetails}>
                탄수화물: {item.NUTR_CONT3} g
              </Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.foodDetails}>
                단백질: {item.NUTR_CONT2} g
              </Text>
              <Text style={styles.foodDetails}>지방: {item.NUTR_CONT4} g</Text>
            </View>
          </Pressable>
        )}
      />
      <Pressable style={styles.nextButton} onPress={loadNextPage}>
        <Text style={styles.nextButtonText}>다음 검색</Text>
      </Pressable>
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
  foodItem: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  foodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  foodName: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
    marginRight: 6,
  },
  servingSize: {
    fontSize: 12,
    color: "#757575",
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  foodDetails: {
    fontSize: 12,
    color: "#555",
  },
  nextButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 12,
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default FoodSearchScreen;
