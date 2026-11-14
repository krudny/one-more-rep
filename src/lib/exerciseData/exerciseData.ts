import type { Exercise } from '../types.ts';
import { DEFAULT_BODY_PART, MUSCLE_TO_BODY_PART } from './exerciseData.constants.ts';
import type { ExerciseFilters } from './exerciseData.types.ts';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item: unknown): item is string => typeof item === 'string' && item.length > 0,
    );
  }
  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }
  return [];
}

function getUniqueStrings(items: string[]): string[] {
  return [...new Set(items)];
}

function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function normalizeExercise(rawRecord: unknown, imageBaseUrl: string): Exercise | null {
  if (!isRecord(rawRecord) || !rawRecord.id || !rawRecord.name) {
    return null;
  }
  const targetMuscles = toStringArray(rawRecord.primaryMuscles);
  const bodyParts = getUniqueStrings(
    targetMuscles.map((muscle: string) => MUSCLE_TO_BODY_PART[muscle] ?? DEFAULT_BODY_PART),
  );
  const images = toStringArray(rawRecord.images).map((imagePath: string) =>
    /^https?:\/\//.test(imagePath) ? imagePath : `${imageBaseUrl}/${imagePath}`,
  );
  return {
    id: String(rawRecord.id),
    name: String(rawRecord.name),
    images,
    bodyParts,
    targetMuscles,
    secondaryMuscles: toStringArray(rawRecord.secondaryMuscles),
    equipments: toStringArray(rawRecord.equipment),
    instructions: toStringArray(rawRecord.instructions),
    category: typeof rawRecord.category === 'string' ? rawRecord.category : null,
    level: typeof rawRecord.level === 'string' ? rawRecord.level : null,
  };
}

export function filterExercises(exercises: Exercise[], filters: ExerciseFilters): Exercise[] {
  const searchQuery = filters.search ? normalizeSearchText(filters.search) : '';
  const searchWords = searchQuery.length > 0 ? searchQuery.split(' ').filter(Boolean) : [];
  const filteredExercises = exercises.filter((exercise: Exercise) => {
    if (filters.bodyPart && !exercise.bodyParts.includes(filters.bodyPart)) {
      return false;
    }
    if (filters.muscle && !exercise.targetMuscles.includes(filters.muscle)) {
      return false;
    }
    if (filters.equipment && !exercise.equipments.includes(filters.equipment)) {
      return false;
    }
    if (searchWords.length > 0) {
      const normalizedName = normalizeSearchText(exercise.name);
      return searchWords.every((word: string) => normalizedName.includes(word));
    }
    return true;
  });

  if (searchWords.length === 0) {
    return filteredExercises;
  }

  return filteredExercises.sort((firstExercise: Exercise, secondExercise: Exercise) => {
    const firstStartsWithQuery = Number(
      normalizeSearchText(firstExercise.name).startsWith(searchQuery),
    );
    const secondStartsWithQuery = Number(
      normalizeSearchText(secondExercise.name).startsWith(searchQuery),
    );
    return secondStartsWithQuery - firstStartsWithQuery;
  });
}

export function getDistinctValues(
  exercises: Exercise[],
  selectValues: (exercise: Exercise) => string[],
): string[] {
  return getUniqueStrings(exercises.flatMap(selectValues)).sort(
    (firstValue: string, secondValue: string) => firstValue.localeCompare(secondValue),
  );
}
