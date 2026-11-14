import { createContext, useCallback, useContext, useMemo, type ReactElement } from 'react';
import { usePersistedRoutines } from '@/hooks/usePersistedRoutines/usePersistedRoutines';
import {
  createRoutineFromDraft,
  createRoutineFromWorkout,
  updateRoutineFromDraft,
} from '@/lib/routine/routine';
import type { Routine, RoutineDraft, Workout } from '@/lib/types';
import type { RoutinesStore, RoutinesStoreProviderProps } from './RoutinesStore.types';

const RoutinesStoreContext = createContext<RoutinesStore | null>(null);

export function RoutinesStoreProvider({ children }: RoutinesStoreProviderProps): ReactElement {
  const { ready, routines, setRoutines } = usePersistedRoutines();

  const getRoutineById = useCallback(
    (routineId: string): Routine | undefined =>
      routines.find((routine: Routine) => routine.id === routineId),
    [routines],
  );

  const createRoutine = useCallback(
    (draft: RoutineDraft): Routine => {
      const createdRoutine = createRoutineFromDraft(draft, Date.now());
      setRoutines((currentList: Routine[]) => [createdRoutine, ...currentList]);
      return createdRoutine;
    },
    [setRoutines],
  );

  const updateRoutine = useCallback(
    (routineId: string, draft: RoutineDraft): Routine | null => {
      const existingRoutine = routines.find((routine: Routine) => routine.id === routineId);
      if (!existingRoutine) {
        return null;
      }
      const updatedRoutine = updateRoutineFromDraft(existingRoutine, draft, Date.now());
      setRoutines((currentList: Routine[]) =>
        currentList.map((routine: Routine) =>
          routine.id === routineId ? updatedRoutine : routine,
        ),
      );
      return updatedRoutine;
    },
    [routines, setRoutines],
  );

  const deleteRoutine = useCallback(
    (routineId: string): void => {
      setRoutines((currentList: Routine[]) =>
        currentList.filter((routine: Routine) => routine.id !== routineId),
      );
    },
    [setRoutines],
  );

  const saveWorkoutAsRoutine = useCallback(
    (workout: Workout): Routine => {
      const createdRoutine = createRoutineFromWorkout(workout, Date.now());
      setRoutines((currentList: Routine[]) => [createdRoutine, ...currentList]);
      return createdRoutine;
    },
    [setRoutines],
  );

  const value = useMemo<RoutinesStore>(
    () => ({
      ready,
      routines,
      getRoutineById,
      createRoutine,
      updateRoutine,
      deleteRoutine,
      saveWorkoutAsRoutine,
    }),
    [
      ready,
      routines,
      getRoutineById,
      createRoutine,
      updateRoutine,
      deleteRoutine,
      saveWorkoutAsRoutine,
    ],
  );

  return <RoutinesStoreContext.Provider value={value}>{children}</RoutinesStoreContext.Provider>;
}

export function useRoutinesStore(): RoutinesStore {
  const context = useContext(RoutinesStoreContext);
  if (!context) {
    throw new Error('useRoutinesStore must be used inside RoutinesStoreProvider');
  }
  return context;
}
