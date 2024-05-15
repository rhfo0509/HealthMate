import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";
import IconRightButton from "../components/IconRightButton";
import { getRole } from "../lib/users";
import TrainerProfile from "../components/TrainerProfile";
import MemberProfile from "../components/MemberProfile";

function MyProfileScreen() {
  const navigation = useNavigation();
  const { user } = useUserContext();
  const [role, setRole] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await getRole(user.id);
      setRole(result);
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

  return role === "trainer" ? (
    <TrainerProfile user={user} />
  ) : (
    <MemberProfile user={user} />
  );
}

export default MyProfileScreen;
