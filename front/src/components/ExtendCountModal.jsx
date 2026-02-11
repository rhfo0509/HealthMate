import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";

import { colors } from "../styles/theme";
function ExtendCountModal({
  visible,
  onClose,
  membershipCount,
  setMembershipCount,
  onSave,
}) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>연장할 횟수를 입력해주세요.</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={membershipCount}
              onChangeText={setMembershipCount}
              keyboardType="number-pad"
              placeholder="0"
            />
            <Text style={styles.unitText}>회</Text>
          </View>
          <View style={styles.modalButtons}>
            <Pressable
              onPress={onSave}
              style={[styles.modalButton, { backgroundColor: colors.primary[500] }]}
            >
              <Text style={{ color: colors.background }}>등록</Text>
            </Pressable>
            <Pressable onPress={onClose} style={styles.modalButton}>
              <Text style={{ color: colors.primary[500] }}>취소</Text>
            </Pressable>
          </View>
        </View>
      </View>
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
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.border.dark,
    marginRight: 8,
    fontSize: 16,
    textAlign: "center",
    width: 120,
  },
  unitText: {
    fontSize: 16,
    color: colors.gray[700],
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 12,
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

export default ExtendCountModal;
