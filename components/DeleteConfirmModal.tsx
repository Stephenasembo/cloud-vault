import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import { Dispatch, SetStateAction } from "react";

export type DeleteConfirmModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => Promise<void>;
  title: string;
  fileName?: string;
};

export default function DeleteConfirmModal({
  modalVisible,
  setModalVisible,
  onConfirm,
  title,
  fileName,
}: DeleteConfirmModalProps) {
  console.log({fileName})
  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.backdrop}
          onPress={() => setModalVisible(false)}
        />

        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalDescription}>
            Are you sure you want to delete{' '}
            <Text style={{ fontWeight: '600'}}>{fileName}</Text>?
            {'\n'}This action cannot be undone
          </Text>

          <View style={styles.modalButtons}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalCard: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },

  modalDescription: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },

  cancelButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  deleteButton: {
    backgroundColor: '#e53935',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  deleteText: {
    color: 'white',
    fontWeight: '600',
  },
});
