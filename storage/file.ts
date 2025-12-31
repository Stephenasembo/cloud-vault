import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, SuccessStorageType } from './types';
import { ErrorType } from '../types/errorType';
import { STORAGE_KEYS, generateFileKey, getFolderFileIndex } from './keys';
import { addIndex, removeIndex } from './cache';

export async function cacheFile(folderId: string, fileId: string, fileData: File): Promise<ErrorType | SuccessStorageType> {
  try{
    const fileKey = generateFileKey(folderId, fileId);
    await AsyncStorage.setItem(fileKey, JSON.stringify(fileData));
    await addIndex(getFolderFileIndex(folderId), fileId);
    return {
      error: false,
      message: 'Successfully cached file data.'
    }
  } catch (e) {
    console.log(e)
    return {
      error: true,
      messageTitle: 'Failed to cache file.'
    }
  }
}

export async function readFolderFilesCache(folderId: string): Promise<File[]> {
  try {
    const fileIndex = await AsyncStorage.getItem(getFolderFileIndex(folderId));
    if(!fileIndex) return [];
    const idArray = JSON.parse(fileIndex);
    const fileArray: (File | null)[] = await Promise.all(
      idArray.map( async(id: string) => {
        const response = await readFileCache(folderId, id);
        if (response.error) return null;
        return response.data;
      })
    )
    return fileArray.filter((file) => file !== null);
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function readFileCache(folderId: string, fileId: string): Promise<ErrorType | SuccessStorageType> {
  try {
    const fileKey = generateFileKey(folderId, fileId)
    const cacheData = await AsyncStorage.getItem(fileKey);
    if(!cacheData) {
      return {
        error: false,
        message: 'Key not found in storage.',
        data: null,
      }
    }
    return {
      error: false,
      message: 'Successfully retrieved cached file.',
      data: JSON.parse(cacheData)
    }
  } catch (e) {
    console.log(e)
    return {
      error: true,
      messageTitle: 'Error on retrieving cached file.'
    }
  }
}

export async function removeFileCache(folderId: string, fileId: string) {
  try {
    const fileKey = generateFileKey(folderId, fileId);
    await AsyncStorage.removeItem(fileKey);
    await removeIndex(STORAGE_KEYS.FILE_INDEX, fileId);
    return {
      error: false,
      message: 'Successfully removed file cache.'
    }
  } catch (e) {
    console.log(e);
    return {
      error: true,
      messageTitle: 'Error on removing cached file.'
    }
  }
}

export async function syncFilesCache(files: File[]) {
  const fileIds = files.map((file) => file.id);
  await AsyncStorage.setItem(STORAGE_KEYS.FILE_INDEX, JSON.stringify(fileIds));
  await Promise.all(
    files.map((file: File) => {
      const fileKey = `${STORAGE_KEYS.FILES}:${file.id}`;
      return AsyncStorage.setItem(fileKey, JSON.stringify(file));
    })
  )
}