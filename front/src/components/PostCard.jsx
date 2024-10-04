import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import Avatar from "./Avatar";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import useActions from "../hooks/useActions";
import VideoView from "./VideoView";
import { getRole } from "../lib/users";
import { getFoods } from "../lib/foods"; // getFoods 함수 임포트

function PostCard({ author, URL, content, createdAt, id, isDetailMode }) {
  const navigation = useNavigation();
  const date = useMemo(
    () =>
      createdAt ? new Date(createdAt.seconds * 1000).toLocaleString() : "",
    [createdAt]
  );
  const { user } = useUserContext();
  const isMyPost = user.id === author.id;
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [foods, setFoods] = useState([]); // foods 상태 추가

  const onPressPost = () => {
    navigation.navigate("Post", {
      author,
      URL,
      content,
      createdAt,
      id,
      isDetailMode: true,
    });
  };

  const { onPressMore } = useActions({ id, content });

  const isVideo = (URL) => /\.(mp4|mov|avi)/i.test(URL);

  useEffect(() => {
    const fetchRole = async () => {
      setIsLoading(true);
      const result = await getRole(author.id);
      setRole(result);
      setIsLoading(false);
    };

    fetchRole();
  }, [author.id]);

  // foods 데이터를 가져오는 useEffect 추가
  useEffect(() => {
    const fetchFoods = async () => {
      if (isDetailMode) {
        try {
          const foodDocs = await getFoods(id); // postId를 기준으로 foods 가져오기
          if (foodDocs.length > 0) {
            setFoods(foodDocs[0].foods || []); // 가져온 데이터에서 foods 배열 설정
          } else {
            setFoods([]); // 데이터가 없는 경우 빈 배열 설정
          }
        } catch (error) {
          console.error("Error fetching foods:", error);
          setFoods([]);
        }
      }
    };

    fetchFoods();
  }, [id, isDetailMode]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.profile}>
          <Avatar source={author.photoURL && { uri: author.photoURL }} />
          <View style={styles.profileInfo}>
            <Text style={styles.displayName}>{author.displayName}</Text>
            {isLoading ? (
              <ActivityIndicator size="small" color="#757575" />
            ) : (
              <Text style={styles.role}>
                {role === "trainer" ? "트레이너" : "회원"}
              </Text>
            )}
          </View>
        </View>
        {isMyPost && (
          <Pressable hitSlop={8} onPress={onPressMore}>
            <MaterialIcons name="more-vert" size={24} color="#757575" />
          </Pressable>
        )}
      </View>
      <Pressable
        style={[
          styles.contentContainer,
          isDetailMode && { flexDirection: "column" },
        ]}
        onPress={onPressPost}
        disabled={isDetailMode}
      >
        {isVideo(URL) ? (
          <VideoView URL={URL} isDetailMode={isDetailMode} />
        ) : URL ? (
          <View>
            <Pressable onPress={() => setShow(true)} disabled={!isDetailMode}>
              <Image
                source={{ uri: URL }}
                style={[
                  styles.media,
                  isDetailMode && { width: "100%", aspectRatio: 16 / 9 },
                ]}
              />
            </Pressable>
            <Modal
              visible={show}
              animationType="fade"
              onRequestClose={() => setShow(false)}
            >
              <View style={styles.imageViewer}>
                <Image
                  source={{ uri: URL }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMethod="resize"
                  resizeMode="contain"
                />
              </View>
            </Modal>
          </View>
        ) : null}
        <View style={styles.textContainer}>
          <Text
            style={styles.contentText}
            numberOfLines={isDetailMode ? undefined : 7}
            ellipsizeMode={isDetailMode ? undefined : "tail"}
          >
            {content}
          </Text>
          {isDetailMode &&
            foods.length > 0 && ( // foods가 있을 때만 표시
              <View style={styles.foodsContainer}>
                {foods.map((food, index) => (
                  <View key={food.id || index} style={styles.foodItem}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <View style={styles.nutritionRow}>
                      <Text style={[styles.nutrient, styles.calories]}>
                        칼 {parseFloat(food.calories).toFixed(2)}
                      </Text>
                      <Text style={[styles.nutrient, styles.carbs]}>
                        탄 {parseFloat(food.carbs).toFixed(2)}
                      </Text>
                      <Text style={[styles.nutrient, styles.protein]}>
                        단 {parseFloat(food.protein).toFixed(2)}
                      </Text>
                      <Text style={[styles.nutrient, styles.fat]}>
                        지 {parseFloat(food.fat).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
        </View>
      </Pressable>
      <View style={styles.footer}>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 12,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileInfo: {
    marginLeft: 12,
  },
  displayName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  role: {
    color: "#757575",
  },
  contentContainer: {
    flexDirection: "row",
  },
  media: {
    width: 180,
    height: 180,
    marginLeft: 16,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  date: {
    fontSize: 12,
    color: "#757575",
  },
  imageViewer: {
    padding: 16,
  },
  foodsContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  foodItem: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 8,
  },
  foodName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  nutritionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  nutrient: {
    marginRight: 6,
    paddingHorizontal: 4,
    borderRadius: 4,
    fontSize: 14,
    color: "#fff",
  },
  calories: {
    backgroundColor: "#ffab91",
  },
  carbs: {
    backgroundColor: "#81d4fa",
  },
  protein: {
    backgroundColor: "#aed581",
  },
  fat: {
    backgroundColor: "#ffcc80",
  },
});

export default PostCard;
