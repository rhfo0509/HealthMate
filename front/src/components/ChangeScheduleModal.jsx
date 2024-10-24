import React, { useState } from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import { CheckBox } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";

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
                { backgroundColor: "#1f6feb" },
                isLoading && styles.disabledButton,
              ]}
            >
              <Text style={{ color: "#fff" }}>등록</Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              disabled={isLoading}
              style={[styles.modalButton, isLoading && styles.disabledButton]}
            >
              <Text style={{ color: "#1f6feb" }}>취소</Text>
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
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 4,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
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
    marginRight: 10,
    marginBottom: 5,
    color: "#333",
  },
  checkBox: {
    padding: 0,
    margin: 0,
  },
  timePickerButton: {
    flex: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f0f4f8",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  disabledButton: {
    backgroundColor: "#e0e0e0",
    borderColor: "#ccc",
  },
  timeText: {
    fontSize: 14,
    color: "#00796b",
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
    borderColor: "#1f6feb",
  },
});

export default ChangeScheduleModal;
