import { View, Text, StyleSheet, Pressable, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { readFolderUploads, uploadFile, deleteFile } from '../../../../services/storage';
import { useAuthContext } from '../../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { FileObject } from '@supabase/storage-js';
import FileCard from '../../../../components/FileCard';
import { useFoldersContext } from '../../../../context/FoldersContext';
import MenuPopover from '../../../../components/MenuPopover';
import { PickedFileType } from '../../../../types/pickedFile';
import InputModal from '../../../../components/InputModal';
import { updateDisplayName } from '../../../../services/file';
import DeleteConfirmModal from '../../../../components/DeleteConfirmModal';
import { FetchingStatusType } from '../../../../types/fetchingStatus';

export default function FolderScreen() {
  const { userId } = useAuthContext();
  const { id: folderId } = useLocalSearchParams<{ id: string }>();

  const [ files, setFiles] = useState<FileObject[] | []>([]);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [pickedFile, setPickedFile] = useState<PickedFileType | null>(null);
  const [fileFetchingStatus, setFileFetchingStatus] = useState<FetchingStatusType>('idle');

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  async function handleFileEdit() {
    setModalVisible(false)
    if(!pickedFile) {
      console.log("Error updating file name: File id is null")
      return;
    }
    const data = await updateDisplayName(newName, pickedFile.fileId)
    if(!data) return;

    const newFiles = files.map(file => file.id === data.id ? {
      ...file,
      metadata: {...file.metadata, display_name: data.display_name},
    }: file);

    console.log(files);
    console.log(newFiles);

    setFiles(newFiles)
    Alert.alert(
      'File name updated successfully.'
    )
  }

  async function handleFileDelete() {
    setMenuVisible(false);
    setDeleteModalVisible(false);
    if (!userId || !folderId || !pickedFile) return;
    const filePath = `public/${userId}/${folderId}/${pickedFile.name}`;
    const status = await deleteFile(filePath);
    if(status) {
      Alert.alert(
        'File deleted successfully.'
      )
      setFiles(prev => prev.filter(f => f.id !== pickedFile.fileId))
    }
  }


  useEffect(() => {
    async function fetchFiles() {
      if (!userId || !folderId) return;
      setFileFetchingStatus('loading')
      const data = await readFolderUploads(userId, folderId);
      if(data.error) {
        setFileFetchingStatus('error');
        Alert.alert(data.messageTitle);
        return;
      }
      setFileFetchingStatus('success');
      setFiles(data.files)
    }
    fetchFiles()
  }, [userId, folderId])

  async function handleUpload(): Promise<void> {
    if(!userId) return;
    const file = await uploadFile(userId, folderId);
    if(file.error) {
      Alert.alert(
        file.messageTitle,
        file.message,
      )
      return
    }
    Alert.alert(
      'File uploaded successfully.'
    )
    const data = await readFolderUploads(userId, folderId);
    if(!data.error) {
      setFiles(data.files);
    }
  }

  if(!userId || !folderId) return null;
 
  return (
    <View style={styles.container}>
      <Text>Welcome to the folder screen</Text>
      {fileFetchingStatus === 'loading' ? 
        <View style={{ alignItems: 'center', marginTop: 32 }}>
          <ActivityIndicator size='large' />
          <Text style={{ marginTop: 12, color: '#6B7280' }}>
            Fetching files
          </Text>
        </View>
        :
      fileFetchingStatus === 'error' ?
      <Text>Ooops an error occured while fetching files.</Text>
      :
      files.length > 0 ?
      <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={files}
      keyExtractor={(item: FileObject) => item.id}
      renderItem={({item}) => (
        <FileCard
        name={item.metadata.display_name}
        size={item.metadata.size}
        uploadedAt={item.updated_at}
        folderId={folderId}
        setFiles={setFiles}
        id={item.id}
        fileType={item.metadata.mimetype}
        openMenu={(pickedFile: PickedFileType) => {
          setMenuVisible(true);
          setPickedFile(pickedFile)
        }}
        />
      )}
      /> :
      <View>
        <Text>No files uploaded yet.</Text>
      </View>
      }

      {pickedFile &&
        <MenuPopover
          userId={userId}
          folderId={folderId}
          name={pickedFile.name}
          fileId={pickedFile.fileId}
          coordinates={pickedFile.coordinates}
          menuVisible={menuVisible}
          setMenuVisible={setMenuVisible}
          setFiles={setFiles}
          setModalVisible={setModalVisible}
          setDeleteModalVisible={setDeleteModalVisible}
          />
      }

      <InputModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      setNewName={setNewName}
      handleNewName={handleFileEdit}
      modalTitle="Edit file name"
      />

      <DeleteConfirmModal
      modalVisible={deleteModalVisible}
      setModalVisible={setDeleteModalVisible}
      onConfirm={handleFileDelete}
      title = "Delete file"
      assetName={pickedFile?.name}
      />
      
      <Pressable
      style={styles.addButton}
      onPress={handleUpload}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    fontSize: 44,
    color: 'white'
  },

})