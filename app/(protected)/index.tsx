import { useState } from "react"
import { View, Text, StyleSheet, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform, Alert, FlatList } from "react-native" 
import { createFolder } from "../../services/folder";
import { useAuthContext } from "../../context/AuthContext";
import FolderCard from "../../components/Folder";
import { useFoldersContext } from "../../context/FoldersContext";
import { Folder } from "../../types/folder";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  const { userId } = useAuthContext();
  const { userFolders } = useFoldersContext();

  async function handleFolderName() {
    setModalVisible(false);
    await createFolder(folderName, userId);
    Alert.alert(
      'Testing supabase functions',
      `New folder created`
    )
  }

  return (
    <View style={styles.container}>
      <Text>Welcome to CloudVault</Text>
      <View style={styles.folderContainer}>
        <FlatList
        contentContainerStyle={styles.listContent}
        data={userFolders}
        keyExtractor={(item: Folder) => item.id}
        renderItem={({item}) => (
          <FolderCard
          folderName={item.name}
          />
        )}
        />
      </View>
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

  folderContainer: {
    width: '100%',
    marginVertical: 16,
  },

  listContent: {
    paddingHorizontal: 16,
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