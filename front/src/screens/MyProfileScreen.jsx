import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { colors } from "../styles/theme";

import { useUserContext } from "../contexts/UserContext";
import { getRole } from "../lib/users";
import TrainerProfile from "../components/TrainerProfile";
import MemberProfile from "../components/MemberProfile";
import MemberStatTab from "../navigation/MemberStatTab";

function MyProfileScreen() {
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

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  // 로딩 이후 역할에 따른 프로필 화면 표시
  return (
    <View style={styles.container}>
      {role === "trainer" ? (
        <TrainerProfile user={user} />
      ) : (
        <>
          <MemberProfile user={user} />
          <MemberStatTab user={user} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});

export default MyProfileScreen;