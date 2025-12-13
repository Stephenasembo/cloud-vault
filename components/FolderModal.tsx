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
import { Dispatch, SetStateAction } from "react";

export type FolderModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  setFolderName: Dispatch<SetStateAction<string>>;
  handleFolderName: () => Promise<void>;
  modalTitle: string;
}

export default function FolderModal({
  modalVisible,
  setModalVisible,
  setFolderName,
  handleFolderName,
  modalTitle,
}: FolderModalProps) {
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
          onChangeText={setFolderName}
          />
        </View>
        <View style={styles.modalButtons}>
          <Pressable
          onPress={() => setModalVisible(false)}
          style={styles.modalButton}
          >
            <Text>Cancel</Text>
          </Pressable>
          <Pressable
          onPress={handleFolderName}
          style={styles.modalButton}
          >
            <Text>Save</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },

  modalButton: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
  },
})