import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ColorTheme, useThemeContext } from "../context/ThemeContext";

export type DeleteConfirmModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => Promise<void>;
  title: string;
  assetName?: string;
};

export default function DeleteConfirmModal({
  modalVisible,
  setModalVisible,
  onConfirm,
  title,
  assetName,
}: DeleteConfirmModalProps) {

  const { colors } = useThemeContext();

  const styles = useMemo(() => createThemedStyles(colors), [colors]);

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
            <Text style={{ fontWeight: '600'}}>{assetName}</Text>?
            {'\n'}This action cannot be undone
          </Text>

          <View style={styles.modalButtons}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
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

const createThemedStyles = (colors: ColorTheme) => (
  StyleSheet.create({
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
      backgroundColor: colors.background,
      padding: 20,
      borderRadius: 16,
      elevation: 5,
    },

    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 16,
      color: colors.primary,
    },

    modalDescription: {
      textAlign: 'center',
      color: colors.textSecondary,
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
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderColor: colors.menuBorder,
    },

    cancelText: {
      fontSize: 15,
      color: colors.textSecondary,
    },

    deleteButton: {
      backgroundColor: '#e53935',
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 18,
    },

    deleteText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 15,
    },
  })
);
