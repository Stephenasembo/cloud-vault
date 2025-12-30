import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, SuccessStorageType } from './types';
import { ErrorType } from '../types/errorType';
import { STORAGE_KEYS } from './keys';
import { addIndex } from './cache';

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
