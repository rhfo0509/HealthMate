import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { format } from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/theme";

import { useUserContext } from "../contexts/UserContext";
import { removeBodyData } from "../lib/bodyData";
import { updateUser, getUser } from "../lib/users";

function BodyHistory({ bodyData, setShow, setEditData, memberId }) {
  const { setUser } = useUserContext();

  // 체성분 데이터 삭제 핸들러
  const handleDelete = (id, index) => {
    Alert.alert(
      "알림",
      "해당 데이터를 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await removeBodyData(id);

              // 최신 데이터인지 확인
              if (index === 0) {
                // 최신 데이터가 삭제되면 그 다음 데이터 가져오기
                const nextData = bodyData[1];
                if (nextData) {
                  // 다음 데이터를 updateUser를 통해 반영
                  await updateUser({
                    userId: memberId,
                    updateField: {
                      bodyData: {
                        weight: nextData.weight,
                        SMM: nextData.SMM,
                        PBF: nextData.PBF,
                      },
                    },
                  });
                } else {
                  // 삭제 이후 체성분 데이터가 없는 경우
                  await updateUser({
                    userId: memberId,
                    updateField: { bodyData: null },
                  });
                }

                const updatedUser = await getUser(memberId);
                setUser(updatedUser);
              }
            } catch (error) {
              console.error("데이터 삭제 중 오류 발생:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // 체성분 데이터 수정 핸들러
  const handleEdit = (item) => {
    setEditData(item);
    setShow(true);
  };

  // 체성분 항목 컴포넌트
  const renderItem = ({ item, index }) => {
    let weightDiff = 0;
    let SMMDiff = 0;
    let PBFDiff = 0;
    const previousItem = bodyData[index + 1];

    if (previousItem) {
      weightDiff = parseFloat(item.weight) - parseFloat(previousItem.weight);
      SMMDiff = parseFloat(item.SMM) - parseFloat(previousItem.SMM);
      PBFDiff = parseFloat(item.PBF) - parseFloat(previousItem.PBF);
    }

    return (
      <View style={styles.container}>
        <View style={styles.historyHeader}>
          <Text style={{ fontWeight: "bold" }}>
            {format(item.date.toDate(), "yyyy년 MM월 dd일")}
          </Text>
          <View style={styles.historyButtonGroup}>
            {/* 수정 버튼 */}
            <Pressable
              onPress={() => handleEdit(item)}
              style={styles.editButton}
            >
              <MaterialIcons name="edit" size={20} color={colors.primary[500]} />
            </Pressable>
            {/* 삭제 버튼 */}
            <Pressable
              onPress={() => handleDelete(item.id, index)}
              style={styles.deleteButton}
            >
              <MaterialIcons
                name="remove-circle-outline"
                size={20}
                color={colors.error}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.historyGroup}>
          <View style={styles.history}>
            <Text>체중</Text>
            <Text>{item.weight}kg</Text>
            <Text>
              {Math.abs(weightDiff.toFixed(1))}kg{" "}
              {weightDiff.toFixed(1) >= 0 ? "🔺" : "🔻"}
            </Text>
          </View>
          <View style={styles.history}>
            <Text>골격근량</Text>
            <Text>{item.SMM}kg</Text>
            <Text>
              {Math.abs(SMMDiff.toFixed(1))}kg{" "}
              {SMMDiff.toFixed(1) >= 0 ? "🔺" : "🔻"}
            </Text>
          </View>
          <View style={styles.history}>
            <Text>체지방률</Text>
            <Text>{item.PBF}%</Text>
            <Text>
              {Math.abs(PBFDiff.toFixed(1))}%{" "}
              {PBFDiff.toFixed(1) >= 0 ? "🔺" : "🔻"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      style={{ marginTop: 20 }}
      data={bodyData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={true}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: colors.border.main,
    height: 1,
    width: "100%",
  },
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.dark,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyButtonGroup: {
    flexDirection: "row",
  },
  history: {
    alignItems: "center",
  },
  historyGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  deleteButton: {
    padding: 4,
  },
  editButton: {
    padding: 4,
  },
});

export default BodyHistory;