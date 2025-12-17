import { useState } from "react"
import { View, Text, StyleSheet, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform, Alert, FlatList } from "react-native" 
import { createFolder } from "../../../services/folder";
import { useAuthContext } from "../../../context/AuthContext";
import FolderCard from "../../../components/FolderCard";
import { useFoldersContext } from "../../../context/FoldersContext";
import { Folder } from "../../../types/folder";
import InputModal from "../../../components/InputModal";
import { useRouter } from "expo-router";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  const { userFolders, addFolder } = useFoldersContext();
  const router = useRouter();

  async function handleFolderName() {
    setModalVisible(false);
    await addFolder(folderName);
    Alert.alert(
      'Testing supabase functions',
      `New folder created`
    )
  }

  function openFolder(id: string) {
    router.navigate(`/home/folder/${id}`)
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
          folderId={item.id}
          openFolder={openFolder}
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
        <InputModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setNewName={setFolderName}
        handleNewName={handleFolderName}
        modalTitle="Create new folder"
        />
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

  button: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
  },
})