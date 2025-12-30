import AsyncStorage from '@react-native-async-storage/async-storage';
import { SuccessStorageType } from './types';
import { Folder } from '../types/folder';
import { ErrorType } from '../types/errorType';
import { STORAGE_KEYS } from './keys';
import { addIndex, removeIndex } from './cache';

export async function cacheFolder(folderId: string, folderData: Folder): Promise<ErrorType | SuccessStorageType> {
  try {
    const folderKey = `${STORAGE_KEYS.FOLDERS}:${folderId}`;
    await AsyncStorage.setItem(folderKey, JSON.stringify(folderData));
    await addIndex(STORAGE_KEYS.FOLDER_INDEX, folderId);
    return {
      error: false,
      message: 'Successfully cached folder data.',
    }
  } catch (e) {
    console.log(e);
    return {
      error: true,
      messageTitle: 'Failed to cache folder.'
    }
  }
}

export async function readFolderCache(folderId: string): Promise<ErrorType | SuccessStorageType> {
  try {
    const folderKey = `${STORAGE_KEYS.FOLDERS}:${folderId}`;
    const cacheData = await AsyncStorage.getItem(folderKey);
    if(!cacheData) {
      return {
        error: false,
        message: 'Key not found in storage.',
        data: null,
      }
    }
    return {
      error: false,
      message: 'Successfully retrieved cached folder data.',
      data: JSON.parse(cacheData)
    }
  } catch (e) {
    console.log(e);
    return {
      error: true,
      messageTitle: 'Error on retrieving cached folder data.'
    }
  }
}

export async function readAllFoldersCache(): Promise<Folder[]> {
  const storedIndex = await AsyncStorage.getItem(STORAGE_KEYS.FOLDER_INDEX);
  if(!storedIndex) return [];
  const idArray = JSON.parse(storedIndex);
  const folderArray: (Folder | null)[] = await Promise.all(idArray.map(async (id: string) => {
    const response = await readFolderCache(id);
    if(response.error) return null;
    return response.data;
  }));
  return folderArray.filter((folder) => folder !== null)
}

export async function removeFolderCache(folderId: string) {
  try {
    const folderKey = `${STORAGE_KEYS.FOLDERS}:${folderId}`;
    await AsyncStorage.removeItem(folderKey);
    await removeIndex(STORAGE_KEYS.FOLDER_INDEX, folderId);
    return {
      error: false,
      message: 'Successfully removed folder cache.'
    }
  } catch (e) {
    console.log(e);
    return {
      error: true,
      messageTitle: 'Error on removing cached folder.'
    }
  }
}

export async function syncFoldersCache(folders: Folder[]) {
  const folderIds = folders.map((folder) => folder.id);
  await AsyncStorage.setItem(STORAGE_KEYS.FOLDER_INDEX, JSON.stringify(folderIds));
  await Promise.all(
    folders.map((folder: Folder) => {
      const folderKey = `${STORAGE_KEYS.FOLDERS}:${folder.id}`;
      return AsyncStorage.setItem(folderKey, JSON.stringify(folder));
    })
  )
}