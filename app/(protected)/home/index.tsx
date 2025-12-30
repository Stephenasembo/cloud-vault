import { useState } from "react"
import { View, Text, StyleSheet, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform, Alert, FlatList, ActivityIndicator, RefreshControl } from "react-native" 
import { createFolder } from "../../../services/folder";
import { useAuthContext } from "../../../context/AuthContext";
import FolderCard, { PickedFolder } from "../../../components/FolderCard";
import { useFoldersContext } from "../../../context/FoldersContext";
import { Folder } from "../../../types/folder";
import InputModal from "../../../components/InputModal";
import { useRouter } from "expo-router";
import EmptyState from "../../../components/emptyState";
import Toast from 'react-native-toast-message';
import FolderMenu from "../../../components/FolderMenu";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import { COLORS } from "../../(auth)";
import { useDeviceContext } from "../../../context/DeviceContext";

export default function Home() {
  const [folderMenuVisible, setFolderMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  const { userFolders, addFolder, folderFetchingStatus, editUserFolder, deleteUserFolder, refreshFolders } = useFoldersContext();
  const [pickedFolder, setPickedFolder] = useState<PickedFolder | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState(folderName);
  const [refreshing, setRefreshing] = useState(false);
  const { networkStatus } = useDeviceContext();

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

  async function handleEdit() {
    setEditModalVisible(false)
    if(!pickedFolder) return;
    const data = await editUserFolder(newFolderName, pickedFolder.id)
    if(data.error) {
      return Toast.show({
        type: 'error',
        text1: data.messageTitle,
      })
    }
    Toast.show({
      type: 'success',
      text1: data.message
    })
  }

  async function handleDelete() {
    setDeleteModalVisible(false);
    if(!pickedFolder) return;
    const data = await deleteUserFolder(pickedFolder.id);
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

  async function handleRefresh() {
    setRefreshing(true)
    if(networkStatus === 'offline') {
      Toast.show({
        type: 'error',
        text1: 'Please connect to the internet to refresh app.'
      })
      setRefreshing(false);
      return;
    }
    await refreshFolders()
    setRefreshing(false);
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>
        }
        keyExtractor={(item: Folder) => item.id}
        renderItem={({item}) => (
          <FolderCard
          folderName={item.name}
          folderId={item.id}
          openMenu={(pickedFolder: PickedFolder) => {
            setFolderMenuVisible(true);
            setPickedFolder(pickedFolder);
          }}
          handleOpen={() => router.navigate({
            pathname: `/home/folder/${item.id}`,
            params: {folderName: item.name}})}
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
      {pickedFolder &&
      <View>
        <FolderMenu
        folderId={pickedFolder.id}
        menuVisible={folderMenuVisible}
        setMenuVisible={setFolderMenuVisible}
        coordinates={pickedFolder.coordinates}
        setEditModalVisible={setEditModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        />
        <InputModal
        modalVisible={editModalVisible}
        setModalVisible={setEditModalVisible}
        setNewName={setNewFolderName}
        handleNewName={handleEdit}
        modalTitle="Edit folder name"
        />
        <DeleteConfirmModal
        modalVisible={deleteModalVisible}
        setModalVisible={setDeleteModalVisible}
        onConfirm={handleDelete}
        title = "Delete folder"
        assetName={pickedFolder.name}
        />
      </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  headingContainer: {
    padding: 16,
    alignItems: 'center',
  },

  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },

  folderContainer: {
    flex: 1,
    width: '100%',
    marginVertical: 16,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },

    elevation: 6,
  },

  addButtonText: {
    fontSize: 32,
    color: 'white',
    fontWeight: '400',
  },

  button: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
  },
})