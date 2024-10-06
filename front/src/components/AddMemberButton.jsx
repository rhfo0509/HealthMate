import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // 네비게이션 훅 추가

function AddMemberButton() {
  const navigation = useNavigation(); // 네비게이션 객체 사용

  const onPress = () => {
    navigation.navigate("AddMembership");
  };

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.circle} onPress={onPress}>
        <MaterialIcons name="person-add" size={24} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 5,
    borderRadius: 27,
    height: 54,
    width: 54,
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  circle: {
    backgroundColor: "#1f6feb",
    borderRadius: 27,
    height: 54,
    width: 54,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddMemberButton;
