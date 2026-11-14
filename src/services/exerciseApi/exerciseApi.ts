import {
  filterExercises,
  getDistinctValues,
  normalizeExercise,
} from '@/lib/exerciseData/exerciseData';
import type { ExerciseFilters } from '@/lib/exerciseData/exerciseData.types';
import type { Exercise } from '@/lib/types';
import {
  CACHE_KEY,
  DATA_URL,
  IMAGE_BASE_URL,
  PAGE_SIZE,
  REFRESH_AFTER_MS,
  REQUEST_TIMEOUT_MS,
} from './exerciseApi.constants';
import type {
  CacheEntry,
  ExerciseMemoryCache,
  ExercisePage,
  FilterOptions,
} from './exerciseApi.types';
import { loadJson, saveJson } from '@/services/storage/storage';

let memoryCache: ExerciseMemoryCache | null = null;
let loadingPromise: Promise<Exercise[]> | null = null;

function setMemoryCache(rawRecords: unknown[]): Exercise[] {
  const list = rawRecords
    .map((rawRecord: unknown) => normalizeExercise(rawRecord, IMAGE_BASE_URL))
    .filter((exercise: Exercise | null): exercise is Exercise => exercise !== null)
    .sort((firstExercise: Exercise, secondExercise: Exercise) =>
      firstExercise.name.localeCompare(secondExercise.name),
    );
  memoryCache = {
    list,
    byId: new Map(list.map((exercise: Exercise) => [exercise.id, exercise])),
  };
  return list;
}

function extractRawExercises(parsedJson: unknown): unknown[] | null {
  if (Array.isArray(parsedJson)) {
    return parsedJson;
  }
  if (
    typeof parsedJson === 'object' &&
    parsedJson !== null &&
    'data' in parsedJson &&
    Array.isArray(parsedJson.data)
  ) {
    return parsedJson.data;
  }
  return null;
}

async function downloadExercises(): Promise<unknown[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout((): void => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(DATA_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Exercise download failed (${response.status})`);
    }
    const parsedJson: unknown = await response.json();
    const rawRecords = extractRawExercises(parsedJson);
    if (!rawRecords || rawRecords.length === 0) {
      throw new Error('Exercise data has an unexpected format');
    }
    const cacheEntry: CacheEntry = { savedAt: Date.now(), source: DATA_URL, raw: rawRecords };
    await saveJson(CACHE_KEY, cacheEntry);
    return rawRecords;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function loadAllExercises(): Promise<Exercise[]> {
  if (memoryCache) {
    return Promise.resolve(memoryCache.list);
  }
  if (loadingPromise) {
    return loadingPromise;
  }
  loadingPromise = (async (): Promise<Exercise[]> => {
    try {
      const cached = await loadJson<CacheEntry>(CACHE_KEY);
      if (
        cached !== undefined &&
        Array.isArray(cached.raw) &&
        cached.raw.length > 0 &&
        cached.source === DATA_URL
      ) {
        const list = setMemoryCache(cached.raw);
        if (Date.now() - cached.savedAt > REFRESH_AFTER_MS) {
          downloadExercises()
            .then(setMemoryCache)
            .catch(() => {});
        }
        return list;
      }
      return setMemoryCache(await downloadExercises());
    } finally {
      loadingPromise = null;
    }
  })();
  return loadingPromise;
}

export async function getExercises(filters: ExerciseFilters, offset = 0): Promise<ExercisePage> {
  const matches = filterExercises(await loadAllExercises(), filters);
  const items = matches.slice(offset, offset + PAGE_SIZE);
  return { items, hasMore: offset + items.length < matches.length, total: matches.length };
}

export async function getExercise(exerciseId: string): Promise<Exercise> {
  await loadAllExercises();
  const found = memoryCache !== null ? memoryCache.byId.get(exerciseId) : undefined;
  if (!found) {
    throw new Error('Exercise not found');
  }
  return found;
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const allExercises = await loadAllExercises();
  return {
    bodyParts: getDistinctValues(allExercises, (exercise: Exercise) => exercise.bodyParts),
    muscles: getDistinctValues(allExercises, (exercise: Exercise) => exercise.targetMuscles),
    equipments: getDistinctValues(allExercises, (exercise: Exercise) => exercise.equipments),
  };
}

export async function refreshExercises(): Promise<number> {
  return setMemoryCache(await downloadExercises()).length;
}
