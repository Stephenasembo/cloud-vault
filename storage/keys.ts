import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorType } from '../types/errorType';

type Folder = {
  id: string;
  name: string;
}

type User = {
  id: string;
}

type File = {
  id: string;
  folderId: string;
  name: string;
  storagePath: string;
  uploadedAt: string;
  size: string;
  type: string;
}

type SuccessStorageType = {
  error: false;
  message: string;
  data?: User | Folder | File | null;
}

export const STORAGE_KEYS = {
  USER: '@cloudvault:user',
  FOLDERS: '@cloudvault:folders',
  FILES: '@cloudvault:files',

  FOLDER_INDEX: '@cloudvault:folders:all',
  FILE_INDEX: '@cloudvault:files:all',
}

export async function cacheUserData(userData: User): Promise<ErrorType | SuccessStorageType> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    return {
      error: false,
      message: 'Successfully cached user data',
    }
  } catch (e) {
    console.log(e);
    return {
      error: true,
      messageTitle: 'Error on caching user data.'
    }
  }
}

export async function readUserCache(): Promise<ErrorType | SuccessStorageType> {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if(!userData) {
      return {
        error: false,
        message: 'Key not found in storage.',
        data: null,
      }
    }
    return {
      error: false,
      message: 'Successfully retrieved cached user data.',
      data: JSON.parse(userData),
    }
  } catch (e) {
    console.log(e);
    return {
      error: true,
      messageTitle: 'Error on retrieving cached user data.'
    }
  }
}

export async function addIndex(key: string, id: string) {
  const storedIndex = await AsyncStorage.getItem(key);
  let newIndex: string[];

  if(!storedIndex) {
    newIndex = [];
  } else {
    newIndex = JSON.parse(storedIndex);
  }

  if(!(newIndex.includes(id))) {
    newIndex.push(id);
    await AsyncStorage.setItem(key, JSON.stringify(newIndex));
  }
}

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
