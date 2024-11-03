import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useUserContext } from "../contexts/UserContext";
import { getRole } from "../lib/users";
import IconRightButton from "../components/IconRightButton";
import TrainerProfile from "../components/TrainerProfile";
import MemberProfile from "../components/MemberProfile";
import MemberStatTab from "../navigation/MemberStatTab";

function MyProfileScreen() {
  const navigation = useNavigation();
  const { user } = useUserContext();

  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 역할 가져오기
  useEffect(() => {
    (async () => {
      try {
        const result = await getRole(user.id);
        setRole(result);
      } catch (error) {
        console.error("사용자 역할을 가져오는 중 에러 발생:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user.id]);

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
        <ActivityIndicator size="large" color="#1f6feb" />
      </View>
    );
  }

  // 로딩 이후 역할에 따른 프로필 화면 표시
  return role === "trainer" ? (
    <TrainerProfile user={user} />
  ) : (
    <>
      <MemberProfile user={user} />
      <MemberStatTab user={user} />
    </>
  );
}

export default MyProfileScreen;
