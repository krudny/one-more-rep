import type { WorkoutSet } from '@/lib/types';

export type UseExerciseLogCardResult = {
  selectedSet: WorkoutSet | null;
  selectedIndex: number;
  selectSet: (setId: string) => void;
  completeSelectedSet: () => void;
  handleAddSet: () => void;
  handleUpdateSet: (setId: string, patch: Partial<WorkoutSet>) => void;
  handleRemoveSet: (setId: string) => void;
  handleRemoveExercise: () => void;
};
