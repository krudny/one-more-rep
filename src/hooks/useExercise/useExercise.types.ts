import type { Exercise } from '@/lib/types';

export type UseExerciseResult = {
  exercise: Exercise | null;
  error: string | null;
};
