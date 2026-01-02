import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ColorTheme, useThemeContext } from "../context/ThemeContext";

export type LogoutModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => Promise<void>;
};

export default function LogoutModal({
  modalVisible,
  setModalVisible,
  onConfirm,
}: LogoutModalProps) {

  const { colors } = useThemeContext();

  const styles = useMemo(() => createThemedStyles(colors), [colors])

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
          <Text style={styles.modalTitle}>Log out?</Text>
          <Text style={styles.modalDescription}>
            You will need to sign in again to access your files.
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
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Logout</Text>
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

    logoutButton: {
      backgroundColor: '#e53935',
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 18,
    },

    logoutText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 15,
    },
  })
);