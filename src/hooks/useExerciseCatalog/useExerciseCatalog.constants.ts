import type { FilterKey } from './useExerciseCatalog.types';

export const SEARCH_DEBOUNCE_MS = 350;

export const FilterKeys = {
  BODY_PART: 'bodyPart',
  MUSCLE: 'muscle',
  EQUIPMENT: 'equipment',
} as const;

export const FILTER_KEY_LIST: readonly FilterKey[] = [
  FilterKeys.BODY_PART,
  FilterKeys.MUSCLE,
  FilterKeys.EQUIPMENT,
];

export const FILTER_LABELS: Record<FilterKey, string> = {
  [FilterKeys.BODY_PART]: 'Body part',
  [FilterKeys.MUSCLE]: 'Target muscle',
  [FilterKeys.EQUIPMENT]: 'Equipment',
};
