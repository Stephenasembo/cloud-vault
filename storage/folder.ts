import AsyncStorage from '@react-native-async-storage/async-storage';
import { Folder, SuccessStorageType } from './types';
import { ErrorType } from '../types/errorType';
import { STORAGE_KEYS } from './keys';
import { addIndex } from './cache';

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
