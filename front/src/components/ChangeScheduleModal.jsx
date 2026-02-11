import React, { useState } from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import { CheckBox } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";

import { colors } from "../styles/theme";
function ChangeScheduleModal({
  visible,
  onClose,
  onSave,
  membershipDays,
  setMembershipDays,
  isLoading,
}) {
  const [showPicker, setShowPicker] = useState({ visible: false, day: null });

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "dismissed") {
      setShowPicker({ visible: false, day: null });
      return;
    }

    if (showPicker.day) {
      const hours = selectedTime.getHours().toString().padStart(2, "0");
      const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      const formattedTime = `${hours}:${minutes}`;

      setMembershipDays((prev) => ({
        ...prev,
        [showPicker.day]: { ...prev[showPicker.day], startTime: formattedTime },
      }));
      setShowPicker({ visible: false, day: null });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>변경할 스케줄을 입력해주세요.</Text>
          {Object.entries(membershipDays).map(([day, data]) => (
            <View key={day} style={styles.dayRow}>
              <Text style={styles.dayText}>{day}</Text>
              <CheckBox
                checked={data.checked}
                onPress={() => {
                  setMembershipDays((prevInfo) => ({
                    ...prevInfo,
                    [day]: {
                      ...prevInfo[day],
                      checked: !data.checked,
                    },
                  }));
                }}
                containerStyle={styles.checkBox}
              />
              <Pressable
                style={[
                  styles.timePickerButton,
                  !data.checked && styles.disabledButton,
                ]}
                onPress={() => setShowPicker({ visible: true, day })}
                disabled={!data.checked}
              >
                <Text style={styles.timeText}>
                  {data.startTime ? data.startTime : "시간 선택"}
                </Text>
              </Pressable>
            </View>
          ))}
          <View style={styles.modalButtons}>
            <Pressable
              onPress={onSave}
              disabled={isLoading}
              style={[
                styles.modalButton,
                { backgroundColor: colors.primary[500] },
                isLoading && styles.disabledButton,
              ]}
            >
              <Text style={{ color: colors.background }}>등록</Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              disabled={isLoading}
              style={[styles.modalButton, isLoading && styles.disabledButton]}
            >
              <Text style={{ color: colors.primary[500] }}>취소</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {showPicker.visible && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="spinner"
          onChange={handleTimeChange}
          minuteInterval={30}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 4,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: 'Cafe24SsurroundAir',
    marginBottom: 16,
    textAlign: "center",
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
  },
  dayText: {
    fontSize: 16,
    fontFamily: 'Cafe24SsurroundAir',
    marginRight: 10,
    marginBottom: 5,
    color: colors.text.primary,
  },
  checkBox: {
    padding: 0,
    margin: 0,
  },
  timePickerButton: {
    flex: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  disabledButton: {
    backgroundColor: colors.border.main,
    borderColor: colors.border.dark,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Cafe24SsurroundAir',
    color: colors.primary[600],
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
});

export default ChangeScheduleModal;
