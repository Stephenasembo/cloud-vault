import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, SuccessStorageType } from './types';
import { ErrorType } from '../types/errorType';
import { STORAGE_KEYS } from './keys';

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
