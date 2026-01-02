import { STORAGE_KEYS } from "./keys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeMode } from "./types";

export async function saveThemePreference(theme: ThemeMode) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCE, JSON.stringify(theme));
  } catch (e) {
    console.log(e)
  }
}

export async function getThemePreference(): Promise<ThemeMode> {
  try {
    const preference = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCE);
    if(!preference) return null;
    return JSON.parse(preference);
  } catch (e) {
    console.log(e)
    return null;
  }
}