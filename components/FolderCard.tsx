import { Pressable, View, Text, StyleSheet, Alert } from "react-native"
import { useFoldersContext } from "../context/FoldersContext";
import { Dispatch, SetStateAction, useState } from "react";
import FolderModal from "./FolderModal";

export type FolderCardProps = {
  folderName: string;
  folderId: string;
}

export default function FolderCard ({ folderName, folderId }: FolderCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState(folderName);

  const { deleteUserFolder, editUserFolder } = useFoldersContext();
  
  async function handleDelete(id: string) {
    const message = await deleteUserFolder(id);
    Alert.alert(
      message
    )
  }

  async function handleEdit() {
    setModalVisible(false)
    const message = await editUserFolder(newFolderName, folderId)
    Alert.alert(
      message
    )
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
          onPress={() => handleDelete(folderId)}
          >
            <Text>Delete</Text>
          </Pressable>
        </View>
      </Pressable>
      <FolderModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      setFolderName={setNewFolderName}
      handleFolderName={handleEdit}
      modalTitle="Edit folder name"
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