import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { logOut } from "../lib/auth";
import { createUser } from "../lib/users";
import BorderedInput from "./BorderedInput";
import CustomButton from "./CustomButton";
import { useUserContext } from "../contexts/UserContext";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import Avatar from "./Avatar";

function SetupProfile() {
  const [displayName, setDisplayName] = useState("");
  const navigation = useNavigation();
  const { setUser } = useUserContext();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const storage = getStorage();

  const { params } = useRoute();
  const { uid } = params || {};

  const onSubmit = async () => {
    setLoading(true);

    let photoURL = null;

    if (response) {
      const asset = response.assets[0];
      console.log(asset);
      const extension = asset.uri.split(".").pop();
      const storageRef = ref(storage, `/profile/${uid}.${extension}`);

      // await uploadString(storageRef, asset.uri, "data_url", {
      //   contentType: asset.type,
      // });
      // photoURL = response ? await getDownloadURL(storageRef) : null;
      const img = await fetch(asset.uri);
      const imgBlob = await img.blob();
      await uploadBytesResumable(storageRef, imgBlob).then(async (snapshot) => {
        photoURL = await getDownloadURL(storageRef);
      });
    }
    const user = {
      id: uid,
      displayName,
      photoURL,
    };
    createUser(user);
    setUser(user);
  };
  const onCancel = () => {
    logOut();
    navigation.goBack();
  };
  const onSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setResponse(result);
    }
  };

  return (
    <View style={styles.block}>
      <Pressable onPress={onSelectImage}>
        <Avatar source={response && { uri: response.uri }} size={128} />
      </Pressable>
      <View style={styles.form}>
        <BorderedInput
          placeholder="닉네임"
          value={displayName}
          onChangeText={setDisplayName}
          onSubmitEditing={onSubmit}
          returnKeyType="next"
        />
        {loading ? (
          <ActivityIndicator size={32} color="#6200ee" style={styles.spinner} />
        ) : (
          <View style={styles.buttons}>
            <CustomButton title="다음" onPress={onSubmit} hasMarginBottom />
            <CustomButton title="취소" onPress={onCancel} theme="secondary" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 16,
    width: "100%",
  },
  form: {
    marginTop: 16,
    width: "100%",
  },
  buttons: {
    marginTop: 48,
  },
});

export default SetupProfile;
