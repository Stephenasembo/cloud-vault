import { View, Text, StyleSheet, Pressable, Alert, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { readFolderUploads, uploadFile } from '../../../../services/storage';
import { useAuthContext } from '../../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { FileObject } from '@supabase/storage-js';
import FileCard from '../../../../components/FileCard';
import { useFoldersContext } from '../../../../context/FoldersContext';

export default function FolderScreen() {
  const { userId } = useAuthContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ files, setFiles] = useState<FileObject[] | []>([]);

  useEffect(() => {
    if (!userId || !id) return;
    readFolderUploads(userId, id).then(data => setFiles(data))
  }, [userId, id])

  async function handleUpload(): Promise<void> {
    if(!userId) return;
    const message = await uploadFile(userId, id);
    Alert.alert(
      message
    )
  }
 
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
        />
      )}
      /> :
      <View>
        <Text>No files uploaded yet.</Text>
      </View>
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