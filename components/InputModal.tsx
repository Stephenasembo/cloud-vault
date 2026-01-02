import {
  View,
  Text,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from "react-native";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ColorTheme, useThemeContext } from "../context/ThemeContext";

export type InputModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  setNewName: Dispatch<SetStateAction<string>>;
  handleNewName: () => Promise<void>;
  modalTitle: string;
}

export default function InputModal({
  modalVisible,
  setModalVisible,
  setNewName,
  handleNewName,
  modalTitle,
}: InputModalProps) {

  const { colors } = useThemeContext();

  const styles = useMemo(() => createThemedStyles(colors), [colors]);
  return (
    <Modal
    visible={modalVisible}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setModalVisible(false)}
    >
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.modalOverlay}
    >
      <Pressable
      onPress={() => setModalVisible(false)}
      style={styles.backdrop}
      />
      <View style={styles.modalCard}>
        <View>
          <Text  style={styles.modalTitle}>{modalTitle}</Text>
          <TextInput
          placeholder="Enter folder name"
          style={styles.input}
          autoFocus
          onChangeText={setNewName}
          />
        </View>
        <View style={styles.modalButtons}>
          <Pressable
          onPress={() => setModalVisible(false)}
          style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable
          onPress={handleNewName}
          style={styles.saveButton}
          >
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
  )
}

const createThemedStyles = (colors: ColorTheme) => (
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    modalCard: {
      width: "85%",
      backgroundColor: "white",
      padding: 20,
      borderRadius: 20,
      elevation: 8,

      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },

    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },

    modalTitle: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 24,
      textAlign: 'center',
      color: colors.textPrimary,
    },

    input: {
      backgroundColor: '#F3F4F6',
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginBottom: 24,
      color: colors.primary,
      fontSize: 16,
    },

    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'flex-end',
    },

    cancelButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
    },

    saveButton: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 12,
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
    },

    cancelText: {
      fontSize: 15,
      color: colors.mutedText,
    },

    saveText: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.primary,
    },
  })
)