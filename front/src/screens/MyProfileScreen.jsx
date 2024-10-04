import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";
import IconRightButton from "../components/IconRightButton";
import { getRole } from "../lib/users";
import TrainerProfile from "../components/TrainerProfile";
import MemberProfile from "../components/MemberProfile";

function MyProfileScreen() {
  const navigation = useNavigation();
  const { user } = useUserContext();
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 역할 가져오기
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const result = await getRole(user.id);
        setRole(result);
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setIsLoading(false); // 데이터를 가져온 후 로딩 상태 해제
      }
    };

    fetchRole();
  }, [user.id]);

  // 네비게이션 설정
  useEffect(() => {
    navigation.setOptions({
      title: "내 프로필",
      headerRight: () => (
        <IconRightButton
          name="settings"
          onPress={() => navigation.push("Setting")}
        />
      ),
    });
  }, [navigation, user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="royalblue" />
      </View>
    );
  }

  // 로딩 완료 후 프로필 화면 표시
  return role === "trainer" ? (
    <TrainerProfile user={user} />
  ) : (
    <MemberProfile user={user} />
  );
}

export default MyProfileScreen;
