import type { ReactNode } from 'react';
import type { MoveDirection } from '@/lib/routine/routine.types';
import type { Exercise, Routine, RoutineDraft } from '@/lib/types';

export type RoutineDraftProviderProps = {
  children: ReactNode;
};

export type RoutineDraftContextValue = {
  draft: RoutineDraft;
  hasUnsavedChanges: boolean;
  initNewDraft: () => void;
  initDraftFromRoutine: (routine: Routine) => void;
  clearDraft: () => void;
  setName: (name: string) => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (routineExerciseId: string) => void;
  setExerciseSetCount: (routineExerciseId: string, setCount: number) => void;
  moveExercise: (routineExerciseId: string, direction: MoveDirection) => void;
};
