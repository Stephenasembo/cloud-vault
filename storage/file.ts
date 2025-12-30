import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, SuccessStorageType } from './types';
import { ErrorType } from '../types/errorType';
import { STORAGE_KEYS } from './keys';
import { addIndex, removeIndex } from './cache';

export async function cacheFile(fileId: string, fileData: File): Promise<ErrorType | SuccessStorageType> {
  try{
    const fileKey = `${STORAGE_KEYS.FILES}:${fileId}`;
    await AsyncStorage.setItem(fileKey, JSON.stringify(fileData));
    await addIndex(STORAGE_KEYS.FILE_INDEX, fileId);
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

export async function readFileCache(fileId: string): Promise<ErrorType | SuccessStorageType> {
  try {
    const fileKey = `${STORAGE_KEYS.FILES}:${fileId}`;
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

export async function readAllFilesCache() {
  const storedIndex = await AsyncStorage.getItem(STORAGE_KEYS.FILE_INDEX);
  if(!storedIndex) return [];
  const idArray = JSON.parse(storedIndex);
  const fileArray: (File | null)[] = await Promise.all(idArray.map(async (id: string) => {
    const response = await readFileCache(id);
    if(response.error) return null;
    return response.data;
  }));
  return fileArray.filter((file) => file !== null)

}

export async function removeFileCache(fileId: string) {
  try {
    const fileKey = `${STORAGE_KEYS.FILES}:${fileId}`;
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