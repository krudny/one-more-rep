import type { Workout, WorkoutStats } from '@/lib/types';

export type UseWorkoutDetailsScreenResult = {
  workout: Workout | undefined;
  stats: WorkoutStats | null;
  canSaveAsRoutine: boolean;
  handleSaveAsRoutine: () => void;
  handleDelete: () => void;
};
