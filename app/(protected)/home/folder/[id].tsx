import { View, Text, StyleSheet, Pressable, Alert, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { readFolderUploads, uploadFile, deleteFile } from '../../../../services/storage';
import { useAuthContext } from '../../../../context/AuthContext';
import { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { FileObject } from '@supabase/storage-js';
import FileCard from '../../../../components/FileCard';
import { useFoldersContext } from '../../../../context/FoldersContext';
import MenuPopover from '../../../../components/MenuPopover';
import { PickedFileType } from '../../../../types/pickedFile';
import InputModal from '../../../../components/InputModal';
import { updateDisplayName } from '../../../../services/file';
import DeleteConfirmModal from '../../../../components/DeleteConfirmModal';
import { FetchingStatusType } from '../../../../types/fetchingStatus';
import EmptyState from '../../../../components/emptyState';
import Toast from 'react-native-toast-message';
import { cacheFile, readFolderFilesCache, removeFileCache, syncFilesCache } from '../../../../storage/file';
import {  File, FileMutation } from "../../../../storage/types";
import { useDeviceContext } from '../../../../context/DeviceContext';
import { dequeueMutation, enqueueMutation, readMutationQueue } from '../../../../storage/fileQueue';
import { ColorTheme, useThemeContext } from "../../../../context/ThemeContext";

export default function FolderScreen() {
  const { userId } = useAuthContext();
  const { id: folderId , folderName } = useLocalSearchParams<{ id: string, folderName: string }>();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const { colors } = useThemeContext();

  const styles = useMemo(() => createThemedStyles(colors), [colors]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: folderName || 'Folder',
      headerTitleAlign: 'center',
    })
  }, [folderName])

  const [ files, setFiles] = useState<File[]>([]);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [pickedFile, setPickedFile] = useState<PickedFileType | null>(null);
  const [fileFetchingStatus, setFileFetchingStatus] = useState<FetchingStatusType>('idle');

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<FetchingStatusType>('idle');

  const { networkStatus } = useDeviceContext();

  async function refreshApp() {
    await processFileQueue();
    await fetchFiles();
    await trackChanges();
  }

  async function processFileQueue() {
    if(networkStatus === 'offline') return;
    const queue = await readMutationQueue();
    if(queue.length === 0) return;

    for (const mutation of queue) {
      try {
        switch (mutation.type) {
          case 'RENAME_FILE': {
            const response = await updateDisplayName(mutation.payload.name, mutation.fileId)
            if(response.error) throw new Error();

            const updatedFile = files.find((file) => file.id === mutation.fileId);
            if(!updatedFile) throw new Error();

            await dequeueMutation(mutation);
            await cacheFile(mutation.folderId, mutation.fileId, updatedFile);
            console.log('File mutation cleared')

            break;
          }
          case 'DELETE_FILE': {
            const response = await deleteFile(mutation.payload.filePath, mutation.fileId);
            if(response.error) throw new Error()

            await dequeueMutation(mutation);

            break;
          }
        }
      } catch (e) {
        console.log(e);
        return
      }
    }
  }

  async function fetchFiles() {
    // Read from cache first
    const cachedFiles = await readFolderFilesCache(folderId);
    if(cachedFiles.length > 0) {
      setFiles(cachedFiles);
      setFileFetchingStatus('success');
    }

    // Fetch from backend
    if(networkStatus === 'online') {
      if (!userId || !folderId) return;
      setFileFetchingStatus('loading')
      const data = await readFolderUploads(userId, folderId);
      if(data.error) {
        setFileFetchingStatus('error');
        Alert.alert(data.messageTitle);
        return;
      }
      setFileFetchingStatus('success');
      setFiles(data.files);
      await syncFilesCache(folderId, data.files);
    }
  }

  async function handleFileEdit() {
    setModalVisible(false)
    if(!pickedFile) {
      console.log("Error updating file name: File id is null")
      return;
    }

    if(networkStatus === 'offline') {

      const localFiles = files.filter((f) => f.id === pickedFile.fileId);
      if(localFiles.length === 0) {
        return;
      }

      const localFile: File = localFiles[0]

      const mutation: FileMutation = {
        id: Date.now().toString(),
        type: 'RENAME_FILE',
        folderId,
        fileId: pickedFile.fileId,
        payload: { name: newName }
      }

      setFiles(prev => (
        prev.map((file) => file.id === pickedFile.fileId ? {
          ...file, name: newName
        } : file)
      ))

      await enqueueMutation(mutation);
      await cacheFile(folderId, pickedFile.fileId, localFile);
      await trackChanges();

      return Toast.show({
        type: 'success',
        text1: 'File rename action queued'
      })
    }

    const response = await updateDisplayName(newName, pickedFile.fileId)
    if(response.error) {
      return Toast.show({
        type: 'error',
        text1: response.messageTitle
      })
    }
    const newFiles = files.map(file => file.id === response.data.id ? {
      ...file,
      name: response.data.display_name,
    }: file);

    setFiles(newFiles)
    Toast.show({
      type: 'success',
      text1: response.message,
    })
  }

  async function handleFileDelete() {
    setMenuVisible(false);
    setDeleteModalVisible(false);
    if (!userId || !folderId || !pickedFile) {
      return Toast.show({
        type: 'error',
        text1: 'An error occured while deleting this folder',
        text2: 'Please try again.'
      })
    }

    const filePath = `public/${userId}/${folderId}/${pickedFile.storagePath}`;

    if(networkStatus === 'offline') {
      const mutation: FileMutation = {
        id: Date.now().toString(),
        type: 'DELETE_FILE',
        folderId,
        fileId: pickedFile.fileId,
        payload: {filePath}
      }

      setFiles(prev => prev.filter(f => f.id !== pickedFile.fileId))

      await enqueueMutation(mutation);
      await removeFileCache(folderId, pickedFile.fileId);
      await trackChanges();

      return Toast.show({
        type: 'success',
        text1: 'File delete action queued',
      })
    }

    const response = await deleteFile(filePath, pickedFile.fileId);
    if(response.error) {
      return Toast.show({
        type: 'error',
        text1: response.messageTitle,
      })
    }
    Toast.show({
      type: 'success',
      text1: response.message
    })
    setFiles(prev => prev.filter(f => f.id !== pickedFile.fileId))
  }

  async function handleRefresh() {
    setRefreshing(true);
    if(networkStatus === 'offline') {
      Toast.show({
        type: 'error',
        text1: 'Please connect to the internet to refresh app.'
      })
      setRefreshing(false);
      return;
    }
    await refreshApp();
    setRefreshing(false);
  }


  useEffect(() => {
    refreshApp();

    return () => {
      setHasPendingChanges(false);
    }
  }, [userId, folderId])

  async function handleUpload(): Promise<void> {
    if(networkStatus === 'offline') {
      Alert.alert(
        'File cannot be uploaded while offline',
        'Please connect to the interent and try again.'
      )
      return;
    }

    if(!userId) return;
    setUploadStatus('loading');
    const file = await uploadFile(userId, folderId);
    if(file.error) {
      if (file.message?.includes('picking')) {
        setUploadStatus('idle');
        Toast.show({
          type: 'info',
          text1: 'File picking cancelled.'
        })
        return;
      } else if (file.messageTitle.includes('large')) {
        setUploadStatus('idle');
        Toast.show({
          type: 'error',
          text1: file.messageTitle
        })
        Alert.alert (
          file.messageTitle,
          file.message
        )
        return;
      }
      setUploadStatus('error')
      Toast.show({
        type: 'error',
        text1: file.messageTitle,
        text2: file.message,
      })
      return  
    }
    setUploadStatus('success');
    Toast.show({
      type: 'success',
      text1: 'File uploaded successfully.'
    })

    // Cache uploaded file
    await cacheFile(folderId, file.data.id, file.data);

    const data = await readFolderUploads(userId, folderId);
    if(!data.error) {
      setFiles(data.files);
    } else {
      Toast.show({
        type: 'error',
        text1: 'An error occured while fetching files.'
      })
      return
    }
  }

  async function trackChanges() {
    const queue = await readMutationQueue();
    console.log('file queue', queue)
    if(queue.length > 0) {
      return setHasPendingChanges(true)
    }
    setHasPendingChanges(false);
  }

  if(!userId || !folderId) {
    Toast.show({
      type: 'error',
      text1: 'An error occured while fetching files.'
    })
    return null
  }
 
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Uploaded Files</Text>
      </View>
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
      uploadStatus === 'loading' ?
      <View style={{ alignItems: 'center', marginTop: 32 }}>
        <ActivityIndicator size='large'/>
        <Text style={{ marginTop: 12, color: '#6B7280' }}>Uploading file</Text>
      </View>
      : uploadStatus === 'error' ?
      <View>
        <Text>An error occured while uploading this file.</Text>
      </View>
      :
      <View style={{ flex: 1 }}>
        {
          networkStatus === 'offline' && hasPendingChanges && (
            <View style={styles.pendingContainer}>
              <Text style={styles.pendingText}>
                You have offline changes. Pull to sync when online.
              </Text>
            </View>
          )
        }
        <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={files}
        keyExtractor={(item: File) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>
        }
        ListEmptyComponent={
          <EmptyState
          title='This folder is empty'
          description='Upload a file to get started.'
          helperText='Files up to 5MB are supported.'
          />
        }
        renderItem={({item}) => (
          <FileCard
          name={item.name}
          size={item.size}
          uploadedAt={item.uploadedAt}
          folderId={folderId}
          id={item.id}
          fileType={item.type}
          openMenu={(pickedFile: PickedFileType) => {
            setMenuVisible(true);
            setPickedFile(pickedFile)
          }}
          storagePath={item.name}
          />
        )}
        />
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
          setModalVisible={setModalVisible}
          setDeleteModalVisible={setDeleteModalVisible}
          storagePath={pickedFile.storagePath}
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

const createThemedStyles = (colors: ColorTheme) => (
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    headingContainer: {
      padding: 16,
      alignItems: 'center',
    },

    headingText: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
    },

    pendingContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },

    pendingText: {
      color: colors.mutedText,
      fontWeight: '600',
      textAlign: 'center',
    },

    addButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',

      shadowColor: colors.primary,
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
  }
))