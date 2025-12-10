import { useState } from "react"
import { View, Text, StyleSheet, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native" 

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');

  function handleFolderName() {
    setModalVisible(false)
    Alert.alert(
      'Text Change Reflection',
      `The new folder name is: ${folderName}`
    )
  }

  return (
    <View style={styles.container}>
      <Text>Welcome to CloudVault</Text>
      <Pressable
      style={styles.addButton}
      onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
      <View>
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
                <Text  style={styles.modalTitle}>Create new folder</Text>
                <TextInput
                placeholder="Enter folder name"
                style={styles.input}
                autoFocus
                onChangeText={(e) => setFolderName(e)}
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
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    fontSize: 44,
    color: 'white'
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

  button: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
  },

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

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  }
})