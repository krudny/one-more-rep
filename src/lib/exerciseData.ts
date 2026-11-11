/**
 * Pure helpers for the exercise dataset (normalization, filtering, search).
 * Kept free of React Native imports so they can be unit tested with Node.
 */
import type { Exercise } from './types.ts';

/** Muscle -> body part. The dataset only has muscles, so body parts are derived. */
const MUSCLE_TO_BODY_PART: Record<string, string> = {
  chest: 'chest',
  lats: 'back',
  'middle back': 'back',
  'lower back': 'back',
  traps: 'back',
  shoulders: 'shoulders',
  biceps: 'arms',
  triceps: 'arms',
  forearms: 'arms',
  abdominals: 'core',
  quadriceps: 'legs',
  hamstrings: 'legs',
  glutes: 'legs',
  calves: 'legs',
  abductors: 'legs',
  adductors: 'legs',
  neck: 'neck',
};

const asStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.length > 0) : typeof v === 'string' && v ? [v] : [];

const unique = (xs: string[]) => [...new Set(xs)];

/** Converts a free-exercise-db record into the app's Exercise type. */
export function normalizeExercise(raw: any, imageBaseUrl: string): Exercise | null {
  if (!raw || typeof raw !== 'object' || !raw.id || !raw.name) return null;
  const targetMuscles = asStringArray(raw.primaryMuscles);
  return {
    id: String(raw.id),
    name: String(raw.name),
    images: asStringArray(raw.images).map((p) => (/^https?:\/\//.test(p) ? p : `${imageBaseUrl}/${p}`)),
    bodyParts: unique(targetMuscles.map((m) => MUSCLE_TO_BODY_PART[m] ?? 'other')),
    targetMuscles,
    secondaryMuscles: asStringArray(raw.secondaryMuscles),
    equipments: asStringArray(raw.equipment),
    instructions: asStringArray(raw.instructions),
    category: typeof raw.category === 'string' ? raw.category : undefined,
    level: typeof raw.level === 'string' ? raw.level : undefined,
  };
}

export type ExerciseFilters = {
  search?: string;
  bodyPart?: string;
  muscle?: string;
  equipment?: string;
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function filterExercises(all: Exercise[], f: ExerciseFilters): Exercise[] {
  const words = f.search ? norm(f.search).split(' ').filter(Boolean) : [];
  const result = all.filter((e) => {
    if (f.bodyPart && !e.bodyParts.includes(f.bodyPart)) return false;
    if (f.muscle && !e.targetMuscles.includes(f.muscle)) return false;
    if (f.equipment && !e.equipments.includes(f.equipment)) return false;
    if (words.length) {
      const name = norm(e.name);
      return words.every((w) => name.includes(w));
    }
    return true;
  });
  if (!words.length) return result;
  // Names starting with the query first.
  const q = norm(f.search!);
  return result.sort((a, b) => Number(norm(b.name).startsWith(q)) - Number(norm(a.name).startsWith(q)));
}

export function distinctValues(all: Exercise[], pick: (e: Exercise) => string[]): string[] {
  return unique(all.flatMap(pick)).sort((a, b) => a.localeCompare(b));
}
