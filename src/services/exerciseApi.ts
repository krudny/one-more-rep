/**
 * Single entry point for exercise data.
 *
 * Data comes from free-exercise-db (https://github.com/yuhonas/free-exercise-db),
 * a public-domain dataset of ~870 exercises published as one static JSON file.
 * There is no API key and no rate limit: the whole dataset is downloaded once,
 * cached on the device and searched/filtered locally, so the catalog keeps
 * working offline. It is refreshed in the background when the cache is old.
 *
 * To self-host or switch the source, change `extra.exerciseData` in app.json
 * (or set EXPO_PUBLIC_EXERCISES_URL / EXPO_PUBLIC_EXERCISE_IMAGES_URL) and, if
 * the format differs, adjust `normalizeExercise` in lib/exerciseData.ts.
 */
import Constants from 'expo-constants';
import { distinctValues, filterExercises, normalizeExercise, type ExerciseFilters } from '@/lib/exerciseData';
import type { Exercise } from '@/lib/types';
import { loadJson, saveJson } from './storage';

export type { ExerciseFilters };

const extra = (Constants.expoConfig?.extra?.exerciseData ?? {}) as { url?: string; imageBaseUrl?: string };
const REPO_RAW = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main';
const DATA_URL = process.env.EXPO_PUBLIC_EXERCISES_URL ?? extra.url ?? `${REPO_RAW}/dist/exercises.json`;
const IMAGE_BASE_URL = (
  process.env.EXPO_PUBLIC_EXERCISE_IMAGES_URL ??
  extra.imageBaseUrl ??
  `${REPO_RAW}/exercises`
).replace(/\/+$/, '');

const CACHE_KEY = 'exercises:v1';
const REFRESH_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 30_000;

export const PAGE_SIZE = 30;

type CacheEntry = { savedAt: number; source: string; raw: unknown[] };

let memory: { list: Exercise[]; byId: Map<string, Exercise> } | null = null;
let loading: Promise<Exercise[]> | null = null;

function setMemory(raw: unknown[]): Exercise[] {
  const list = raw
    .map((r) => normalizeExercise(r, IMAGE_BASE_URL))
    .filter((e): e is Exercise => e !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
  memory = { list, byId: new Map(list.map((e) => [e.id, e])) };
  return list;
}

async function download(): Promise<unknown[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(DATA_URL, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Exercise download failed (${res.status})`);
    const json = await res.json();
    const raw = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : null;
    if (!raw || raw.length === 0) throw new Error('Exercise data has an unexpected format');
    await saveJson(CACHE_KEY, { savedAt: Date.now(), source: DATA_URL, raw } satisfies CacheEntry);
    return raw;
  } finally {
    clearTimeout(timer);
  }
}

/** Loads the full catalog: memory -> device cache -> network. */
export function loadAllExercises(): Promise<Exercise[]> {
  if (memory) return Promise.resolve(memory.list);
  if (loading) return loading;
  loading = (async () => {
    try {
      const cached = await loadJson<CacheEntry>(CACHE_KEY);
      if (cached?.raw?.length && cached.source === DATA_URL) {
        const list = setMemory(cached.raw);
        if (Date.now() - cached.savedAt > REFRESH_AFTER_MS) {
          // Refresh quietly; keep using the cache if it fails.
          download().then(setMemory).catch(() => {});
        }
        return list;
      }
      return setMemory(await download());
    } finally {
      loading = null;
    }
  })();
  return loading;
}

export type ExercisePage = { items: Exercise[]; hasMore: boolean; total: number };

export async function getExercises(filters: ExerciseFilters, offset = 0): Promise<ExercisePage> {
  const matches = filterExercises(await loadAllExercises(), filters);
  const items = matches.slice(offset, offset + PAGE_SIZE);
  return { items, hasMore: offset + items.length < matches.length, total: matches.length };
}

export async function getExercise(id: string): Promise<Exercise> {
  await loadAllExercises();
  const found = memory?.byId.get(id);
  if (!found) throw new Error('Exercise not found');
  return found;
}

export type FilterOptions = { bodyParts: string[]; muscles: string[]; equipments: string[] };

export async function getFilterOptions(): Promise<FilterOptions> {
  const all = await loadAllExercises();
  return {
    bodyParts: distinctValues(all, (e) => e.bodyParts),
    muscles: distinctValues(all, (e) => e.targetMuscles),
    equipments: distinctValues(all, (e) => e.equipments),
  };
}

/** Forces a fresh download of the dataset. */
export async function refreshExercises(): Promise<number> {
  return setMemory(await download()).length;
}
