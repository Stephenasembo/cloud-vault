import { View, Text, StyleSheet, Pressable, Alert, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { readFolderUploads, uploadFile } from '../../../../services/storage';
import { useAuthContext } from '../../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { FileObject } from '@supabase/storage-js';
import FileCard from '../../../../components/FileCard';
import { useFoldersContext } from '../../../../context/FoldersContext';
import MenuPopover from '../../../../components/MenuPopover';
import { PickedFileType } from '../../../../types/pickedFile';

export default function FolderScreen() {
  const { userId } = useAuthContext();
  const { id: folderId } = useLocalSearchParams<{ id: string }>();

  const [ files, setFiles] = useState<FileObject[] | []>([]);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [pickedFile, setPickedFile] = useState<PickedFileType | null>(null)

  useEffect(() => {
    if (!userId || !folderId) return;
    readFolderUploads(userId, folderId).then(data => setFiles(data))
  }, [userId, folderId])

  async function handleUpload(): Promise<void> {
    if(!userId) return;
    const file = await uploadFile(userId, folderId);
    if(!file) {
      Alert.alert(
        'An error occured while uploading this file.'
      )
      return
    }
    Alert.alert(
      'File uploaded successfully.'
    )
    const newFiles = await readFolderUploads(userId, folderId);
    setFiles(newFiles); 
  }

  if(!userId || !folderId) return null;
 
  return (
    <View style={styles.container}>
      <Text>Welcome to the folder screen</Text>
      {files.length > 0 ?
      <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={files}
      keyExtractor={(item: FileObject) => item.id}
      renderItem={({item}) => (
        <FileCard
        name={item.name}
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
          setFiles={setFiles}/>
      }

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