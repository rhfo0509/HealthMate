import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useUserContext } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import Avatar from "../components/Avatar";
import * as ImagePicker from "expo-image-picker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import IconRightButton from "../components/IconRightButton";
import { updateUser } from "../lib/users";
// import { changePassword } from "../lib/auth";

function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useUserContext();
  const storage = getStorage();

  const [displayName, setDisplayName] = useState(user.displayName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState(new Date(user.birthDate));
  const [gender, setGender] = useState(user.gender);
  const [response, setResponse] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setShowDatePicker(false);
    if (date) {
      setBirthDate(date);
    }
  };

  const onSubmit = async () => {
    if (password !== confirmPassword) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    let photoURL = user.photoURL;

    if (response) {
      const asset = response.assets[0];
      const extension = asset.uri.split(".").pop();
      const storageRef = ref(storage, `/profile/${user.id}.${extension}`);
      const img = await fetch(asset.uri);
      const imgBlob = await img.blob();
      await uploadBytesResumable(storageRef, imgBlob).then(async () => {
        photoURL = await getDownloadURL(storageRef);
      });
    }

    const updatedUser = {
      ...user,
      displayName,
      phoneNumber,
      birthDate: format(birthDate, "yyyy-MM-dd"),
      gender,
      photoURL,
    };

    // if (password) {
    //   await changePassword(password);
    // }

    await updateUser({ userId: user.id, updateField: updatedUser });

    setUser(updatedUser);
    setLoading(false);
    Alert.alert("알림", "성공적으로 변경되었습니다.");
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="send" />,
    });
  }, [navigation, onSubmit]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1f6feb" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={onSelectImage} style={styles.avatarContainer}>
        <Avatar
          source={response && { uri: response.assets[0].uri }}
          size={128}
        />
      </Pressable>
      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="이름"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>전화번호</Text>
          <TextInput
            style={styles.input}
            placeholder="전화번호 (숫자만 입력)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 변경 (선택 사항)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
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
        <View style={styles.section}>
          <Text style={styles.label}>생년월일</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {format(birthDate, "yyyy년 MM월 dd일")}
            </Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <RNDateTimePicker
            value={birthDate}
            onChange={onDateSelected}
            display="default"
            maximumDate={new Date()}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  form: {
    marginTop: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    marginHorizontal: 5,
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
  buttons: {
    marginTop: 24,
  },
  spinner: {
    marginTop: 32,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProfileScreen;
