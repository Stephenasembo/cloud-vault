import { useState } from "react"
import { View, Text, StyleSheet, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform, Alert, FlatList, ActivityIndicator } from "react-native" 
import { createFolder } from "../../../services/folder";
import { useAuthContext } from "../../../context/AuthContext";
import FolderCard from "../../../components/FolderCard";
import { useFoldersContext } from "../../../context/FoldersContext";
import { Folder } from "../../../types/folder";
import InputModal from "../../../components/InputModal";
import { useRouter } from "expo-router";
import EmptyState from "../../../components/emptyState";
import Toast from 'react-native-toast-message';

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  const { userFolders, addFolder, folderFetchingStatus } = useFoldersContext();
  const router = useRouter();

  async function handleFolderName() {
    setModalVisible(false);
    const data = await addFolder(folderName);
    if(data.error) {
      return Toast.show({
        type: 'error',
        text1: data.messageTitle
      })
    }
    Toast.show({
      type: 'success',
      text1: data.message
    })
  }

  function openFolder(id: string) {
    router.navigate(`/home/folder/${id}`)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Welcome to CloudVault</Text>
      </View>
      {folderFetchingStatus === 'loading' ? 
      <View style={{ alignItems: 'center', marginTop: 32 }}>
        <ActivityIndicator
        size='large'
        />
        <Text style={{ marginTop: 12, color: '#6B7280' }}>
          Fetching your folders.
        </Text>
      </View>
      : folderFetchingStatus === 'error' ?
      <Text>Ooops an error occured while fetching your folders</Text>
      : userFolders.length > 0 ?
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
      :
      <EmptyState
      title='No folders yet'
      description='Create a folder to start organizing your files securely.'
      helperText='Folders help you group related files.'
      />
      }
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

  headingContainer: {
    marginVertical: 16,
    justifyContent: 'flex-start'
  },

  heading: {
    fontSize: 24,
    fontWeight: '700',
  },

  folderContainer: {
    flex: 1,
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