import Constants from 'expo-constants';
import type { ExerciseDataConfig } from './exerciseApi.types';

// Constants.expoConfig.extra is untyped Record<string, any> in expo-constants.
const exerciseDataConfig = (Constants.expoConfig?.extra?.exerciseData ?? {}) as ExerciseDataConfig;

export const REPO_RAW_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main';
export const DATA_URL =
  process.env.EXPO_PUBLIC_EXERCISES_URL ??
  exerciseDataConfig.url ??
  `${REPO_RAW_URL}/dist/exercises.json`;

export const IMAGE_BASE_URL = (
  process.env.EXPO_PUBLIC_EXERCISE_IMAGES_URL ??
  exerciseDataConfig.imageBaseUrl ??
  `${REPO_RAW_URL}/exercises`
).replace(/\/+$/, '');

export const CACHE_KEY = 'exercises:v1';
export const REFRESH_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
export const REQUEST_TIMEOUT_MS = 30_000;
export const PAGE_SIZE = 30;
