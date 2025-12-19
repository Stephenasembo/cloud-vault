import { Pressable, View, Text, StyleSheet, Alert } from "react-native"
import { useFoldersContext } from "../context/FoldersContext";
import { Dispatch, SetStateAction, useState } from "react";
import InputModal from "./InputModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Toast from 'react-native-toast-message';

export type FolderCardProps = {
  folderName: string;
  folderId: string;
  openFolder: (id: string) => void;
}

export default function FolderCard ({ folderName, folderId, openFolder }: FolderCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState(folderName);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const { deleteUserFolder, editUserFolder } = useFoldersContext();
  
  async function handleDelete() {
    const data = await deleteUserFolder(folderId);
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
    setModalVisible(false)
    const data = await editUserFolder(newFolderName, folderId)
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

  return (
    <View>
      <Pressable
      style={styles.card}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text>{folderName}</Text>
          <Pressable
          style={styles.button}
          onPress={() => openFolder(folderId)}
          >
            <Text>Open</Text>
          </Pressable>
          <Pressable
          style={styles.button}
          onPress={() => setModalVisible(true)}
          >
            <Text>Edit</Text>
          </Pressable>
          <Pressable
          style={styles.button}
          onPress={() => setDeleteModalVisible(true)}
          >
            <Text>Delete</Text>
          </Pressable>
        </View>
      </Pressable>
      <InputModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      setNewName={setNewFolderName}
      handleNewName={handleEdit}
      modalTitle="Edit folder name"
      />
      <DeleteConfirmModal
      modalVisible={deleteModalVisible}
      setModalVisible={setDeleteModalVisible}
      onConfirm={handleDelete}
      title = "Delete folder"
      assetName={folderName}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    width: '100%',
  },
  button : {
    borderWidth: 1,
    padding: 10,
    borderRadius: 16,
  }
})