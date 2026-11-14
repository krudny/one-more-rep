import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_PREFIX } from './storage.constants';

export async function loadJson<T>(key: string): Promise<T | undefined> {
  try {
    const rawValue = await AsyncStorage.getItem(STORAGE_PREFIX + key);
    if (rawValue === null) {
      return undefined;
    }
    // JSON.parse returns any; callers supply the expected storage schema T.
    return JSON.parse(rawValue) as T;
  } catch (error) {
    console.warn(`[storage] failed to read ${key}`, error);
    return undefined;
  }
}

export async function saveJson(key: string, value: unknown): Promise<void> {
  try {
    if (value === undefined || value === null) {
      await AsyncStorage.removeItem(STORAGE_PREFIX + key);
      return;
    }
    await AsyncStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[storage] failed to write ${key}`, error);
  }
}
