import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Profile from "../components/Profile";
import { useUserContext } from "../contexts/UserContext";
import IconRightButton from "../components/IconRightButton";
import AddMemberButton from "../components/AddMemberButton";

function MyProfileScreen() {
  const { user } = useUserContext();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconRightButton
          name="settings"
          onPress={() => navigation.push("Setting")}
        />
      ),
    });
  }, [navigation, user]);
  return (
    <>
      <Profile userId={user.id} />
      <AddMemberButton />
    </>
  );
}

export default MyProfileScreen;
