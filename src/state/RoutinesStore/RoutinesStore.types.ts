import type { ReactNode } from 'react';
import type { Routine, RoutineDraft, Workout } from '@/lib/types';

export type RoutinesStoreProviderProps = {
  children: ReactNode;
};

export type RoutinesStore = {
  ready: boolean;
  routines: Routine[];
  getRoutineById: (routineId: string) => Routine | undefined;
  createRoutine: (draft: RoutineDraft) => Routine;
  updateRoutine: (routineId: string, draft: RoutineDraft) => Routine | null;
  deleteRoutine: (routineId: string) => void;
  saveWorkoutAsRoutine: (workout: Workout) => Routine;
};
