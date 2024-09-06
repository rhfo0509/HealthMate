import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { format } from "date-fns";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import RNDateTimePicker from "@react-native-community/datetimepicker";
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
  const navigation = useNavigation();
  const { params } = useRoute();
  const { uid } = params || {};
  const storage = getStorage();

  const { setUser } = useUserContext();
  const [show, setShow] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");

  const onSubmit = async () => {
    setLoading(true);

    let photoURL = null;

    if (response) {
      const asset = response.assets[0];
      console.log(asset);
      const extension = asset.uri.split(".").pop();
      const storageRef = ref(storage, `/profile/${uid}.${extension}`);
      const img = await fetch(asset.uri);
      const imgBlob = await img.blob();
      await uploadBytesResumable(storageRef, imgBlob).then(async (snapshot) => {
        photoURL = await getDownloadURL(storageRef);
      });
    }
    const user = {
      id: uid,
      displayName,
      phoneNumber,
      birthDate: format(birthDate, "yyyy-MM-dd"),
      gender,
      photoURL,
    };
    createUser(user, role);
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

  const onDateSelected = (event, date) => {
    setShow(false);
    setBirthDate(date);
  };

  return (
    <View style={styles.block}>
      <Pressable onPress={onSelectImage}>
        <Avatar
          source={response && { uri: response.assets[0].uri }}
          size={128}
        />
      </Pressable>
      <View style={styles.form}>
        <BorderedInput
          hasMarginBottom
          placeholder="이름"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <BorderedInput
          placeholder="전화번호 (숫자만 입력)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="number-pad"
        />
        <RNPickerSelect
          value={gender}
          onValueChange={(value) => setGender(value)}
          items={[
            { label: "남성", value: "Male" },
            { label: "여성", value: "Female" },
          ]}
          placeholder={{
            label: "성별 선택",
            color: "#ced4da",
          }}
        />
        <RNPickerSelect
          value={role}
          onValueChange={(value) => setRole(value)}
          items={[
            { label: "회원", value: "Member" },
            { label: "트레이너", value: "Trainer" },
          ]}
          placeholder={{
            label: "회원 / 트레이너 선택",
            color: "#ced4da",
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 5,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#e9ecef",
              padding: 10,
              borderRadius: 5,
            }}
            onPress={() => setShow(true)}
          >
            <MaterialIcons name="calendar-month" size={24} color="black" />
            <Text> 생년월일 입력</Text>
          </TouchableOpacity>
          {show && (
            <RNDateTimePicker
              value={birthDate}
              onChange={onDateSelected}
              display="spinner"
              maximumDate={new Date()}
            />
          )}
          <Text>{format(birthDate, "yyyy년 MM월 dd일")}</Text>
        </View>
        {loading ? (
          <ActivityIndicator
            size={32}
            color="royalblue"
            style={styles.spinner}
          />
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
  label: {
    marginBottom: 8,
    fontWeight: "bold",
  },
});

export default SetupProfile;
