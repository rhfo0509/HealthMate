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
      const extension = asset.uri.split(".").pop();
      const storageRef = ref(storage, `/profile/${uid}.${extension}`);
      const img = await fetch(asset.uri);
      const imgBlob = await img.blob();
      await uploadBytesResumable(storageRef, imgBlob).then(async () => {
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
          hasMarginBottom
          placeholder="전화번호 (숫자만 입력)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="number-pad"
        />
        {/* 성별 선택 섹션 */}
        <View style={styles.section}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                gender === "Male" && styles.selectedButton,
              ]}
              onPress={() => setGender("Male")}
            >
              <Text
                style={[
                  styles.optionText,
                  gender === "Male" && styles.selectedText,
                ]}
              >
                남
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                gender === "Female" && styles.selectedButton,
              ]}
              onPress={() => setGender("Female")}
            >
              <Text
                style={[
                  styles.optionText,
                  gender === "Female" && styles.selectedText,
                ]}
              >
                여
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* 회원/트레이너 선택 섹션 */}
        <View style={styles.section}>
          <Text style={styles.label}>구분</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                role === "Member" && styles.selectedButton,
              ]}
              onPress={() => setRole("Member")}
            >
              <Text
                style={[
                  styles.optionText,
                  role === "Member" && styles.selectedText,
                ]}
              >
                회원
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                role === "Trainer" && styles.selectedButton,
              ]}
              onPress={() => setRole("Trainer")}
            >
              <Text
                style={[
                  styles.optionText,
                  role === "Trainer" && styles.selectedText,
                ]}
              >
                트레이너
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* 생년월일 선택 섹션 */}
        <View style={styles.section}>
          <Text style={styles.label}>생년월일</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShow(true)}
          >
            <Text style={styles.dateText}>
              {format(birthDate, "yyyy년 MM월 dd일")}
            </Text>
          </TouchableOpacity>
        </View>
        {show && (
          <RNDateTimePicker
            value={birthDate}
            onChange={onDateSelected}
            display="default"
            maximumDate={new Date()}
          />
        )}
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
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212529",
    width: "30%",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1,
  },
  optionButton: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },
  selectedButton: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  optionText: {
    fontSize: 16,
    color: "#212529",
  },
  selectedText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  dateButton: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },
  dateText: {
    fontSize: 16,
    color: "#212529",
  },
  spinner: {
    marginTop: 32,
  },
});

export default SetupProfile;
