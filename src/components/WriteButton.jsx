import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function WriteButton({ postType, relatedUserId }) {
  const navigation = useNavigation();

  const onPress = () => {
    if (postType === "Diet") {
      navigation.navigate("DietPost", { postType, relatedUserId });
    } else if (postType === "Exercise") {
      navigation.navigate("ExercisePost", { postType, relatedUserId });
    }
  };

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.circle} onPress={onPress}>
        <MaterialIcons name="add" size={24} color="white" />
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
    backgroundColor: "royalblue",
    borderRadius: 27,
    height: 54,
    width: 54,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WriteButton;
