import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactElement,
} from 'react';
import {
  areRoutineDraftsEqual,
  clampSetCount,
  createRoutineExercise,
  moveRoutineExercise,
} from '@/lib/routine/routine';
import { DEFAULT_SET_COUNT } from '@/lib/routine/routine.constants';
import type { MoveDirection } from '@/lib/routine/routine.types';
import type { Exercise, Routine, RoutineDraft, RoutineExercise } from '@/lib/types';
import { EMPTY_ROUTINE_DRAFT } from './RoutineDraft.constants';
import type { RoutineDraftContextValue, RoutineDraftProviderProps } from './RoutineDraft.types';

const RoutineDraftContext = createContext<RoutineDraftContextValue | null>(null);

export function RoutineDraftProvider({ children }: RoutineDraftProviderProps): ReactElement {
  const [draft, setDraft] = useState<RoutineDraft>(EMPTY_ROUTINE_DRAFT);
  const [initialDraft, setInitialDraft] = useState<RoutineDraft>(EMPTY_ROUTINE_DRAFT);

  const initNewDraft = useCallback((): void => {
    setDraft(EMPTY_ROUTINE_DRAFT);
    setInitialDraft(EMPTY_ROUTINE_DRAFT);
  }, []);

  const initDraftFromRoutine = useCallback((routine: Routine): void => {
    const routineSnapshot: RoutineDraft = {
      name: routine.name,
      exercises: routine.exercises.map((routineExercise: RoutineExercise): RoutineExercise => ({
        ...routineExercise,
      })),
    };
    setDraft(routineSnapshot);
    setInitialDraft(routineSnapshot);
  }, []);

  const clearDraft = useCallback((): void => {
    setDraft(EMPTY_ROUTINE_DRAFT);
    setInitialDraft(EMPTY_ROUTINE_DRAFT);
  }, []);

  const setName = useCallback((name: string): void => {
    setDraft((currentDraft: RoutineDraft) => ({ ...currentDraft, name }));
  }, []);

  const addExercise = useCallback((exercise: Exercise): void => {
    const routineExercise = createRoutineExercise(exercise, DEFAULT_SET_COUNT);
    setDraft((currentDraft: RoutineDraft) => ({
      ...currentDraft,
      exercises: [...currentDraft.exercises, routineExercise],
    }));
  }, []);

  const removeExercise = useCallback((routineExerciseId: string): void => {
    setDraft((currentDraft: RoutineDraft) => ({
      ...currentDraft,
      exercises: currentDraft.exercises.filter(
        (routineExercise: RoutineExercise) => routineExercise.id !== routineExerciseId,
      ),
    }));
  }, []);

  const setExerciseSetCount = useCallback((routineExerciseId: string, setCount: number): void => {
    const clampedSetCount = clampSetCount(setCount);
    setDraft((currentDraft: RoutineDraft) => ({
      ...currentDraft,
      exercises: currentDraft.exercises.map((routineExercise: RoutineExercise) =>
        routineExercise.id === routineExerciseId
          ? { ...routineExercise, setCount: clampedSetCount }
          : routineExercise,
      ),
    }));
  }, []);

  const moveExercise = useCallback((routineExerciseId: string, direction: MoveDirection): void => {
    setDraft((currentDraft: RoutineDraft) => ({
      ...currentDraft,
      exercises: moveRoutineExercise(currentDraft.exercises, routineExerciseId, direction),
    }));
  }, []);

  const hasUnsavedChanges = useMemo(
    () => !areRoutineDraftsEqual(draft, initialDraft),
    [draft, initialDraft],
  );

  const value = useMemo<RoutineDraftContextValue>(
    () => ({
      draft,
      hasUnsavedChanges,
      initNewDraft,
      initDraftFromRoutine,
      clearDraft,
      setName,
      addExercise,
      removeExercise,
      setExerciseSetCount,
      moveExercise,
    }),
    [
      draft,
      hasUnsavedChanges,
      initNewDraft,
      initDraftFromRoutine,
      clearDraft,
      setName,
      addExercise,
      removeExercise,
      setExerciseSetCount,
      moveExercise,
    ],
  );

  return <RoutineDraftContext.Provider value={value}>{children}</RoutineDraftContext.Provider>;
}

export function useRoutineDraft(): RoutineDraftContextValue {
  const context = useContext(RoutineDraftContext);
  if (!context) {
    throw new Error('useRoutineDraft must be used inside RoutineDraftProvider');
  }
  return context;
}
