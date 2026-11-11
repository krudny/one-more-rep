import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'omr:';

export const StorageKeys = {
  profile: 'profile',
  workouts: 'workouts',
  activeWorkout: 'activeWorkout',
} as const;

export async function loadJson<T>(key: string): Promise<T | undefined> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw == null ? undefined : (JSON.parse(raw) as T);
  } catch (e) {
    console.warn(`[storage] failed to read ${key}`, e);
    return undefined;
  }
}

export async function saveJson(key: string, value: unknown): Promise<void> {
  try {
    if (value === undefined || value === null) {
      await AsyncStorage.removeItem(PREFIX + key);
    } else {
      await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
    }
  } catch (e) {
    console.warn(`[storage] failed to write ${key}`, e);
  }
}
