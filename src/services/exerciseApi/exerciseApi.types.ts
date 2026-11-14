import type { Exercise } from '@/lib/types';

export type ExerciseDataConfig = {
  url?: string;
  imageBaseUrl?: string;
};

export type CacheEntry = {
  savedAt: number;
  source: string;
  raw: unknown[];
};

export type ExerciseMemoryCache = {
  list: Exercise[];
  byId: Map<string, Exercise>;
};

export type ExercisePage = {
  items: Exercise[];
  hasMore: boolean;
  total: number;
};

export type FilterOptions = {
  bodyParts: string[];
  muscles: string[];
  equipments: string[];
};
