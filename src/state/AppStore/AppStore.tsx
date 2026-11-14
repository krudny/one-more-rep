import { createContext, useCallback, useContext, useMemo, type ReactElement } from 'react';
import { usePersistedStoreState } from '@/hooks/usePersistedStoreState/usePersistedStoreState';
import type { Exercise, Profile, Workout, WorkoutSet } from '@/lib/types';
import {
  appendExerciseToWorkout,
  appendSetToExercise,
  buildFinishedWorkout,
  createNewWorkout,
  mapWorkoutExercise,
  removeExerciseFromWorkout,
  removeWorkoutSet,
  toggleWorkoutPause,
  updateWorkoutSet,
} from '@/lib/workoutMutations/workoutMutations';
import type { AppStoreProviderProps, Store } from './AppStore.types';

const StoreContext = createContext<Store | null>(null);

export function AppStoreProvider({ children }: AppStoreProviderProps): ReactElement {
  const { ready, profile, setProfile, workouts, setWorkouts, active, setActive } =
    usePersistedStoreState();

  const updateActiveWorkout = useCallback(
    (updater: (workout: Workout) => Workout): void => {
      setActive((current: Workout | null) => (current ? updater(current) : null));
    },
    [setActive],
  );

  const updateProfile = useCallback(
    (patch: Partial<Profile>): void =>
      setProfile((currentProfile: Profile) => ({ ...currentProfile, ...patch })),
    [setProfile],
  );

  const startWorkout = useCallback(
    (): void =>
      setActive((current: Workout | null) => current ?? createNewWorkout(profile.defaultIntensity)),
    [profile.defaultIntensity, setActive],
  );

  const discardWorkout = useCallback((): void => setActive(null), [setActive]);

  const finishWorkout = useCallback((): Workout | null => {
    if (!active) return null;
    const finishedWorkout = buildFinishedWorkout(active, profile.weightKg);
    setWorkouts((workoutList: Workout[]) => [finishedWorkout, ...workoutList]);
    setActive(null);
    return finishedWorkout;
  }, [active, profile.weightKg, setActive, setWorkouts]);

  const togglePause = useCallback(
    (): void => updateActiveWorkout(toggleWorkoutPause),
    [updateActiveWorkout],
  );

  const updateActive = useCallback(
    (patch: Partial<Pick<Workout, 'name' | 'intensity'>>): void =>
      updateActiveWorkout((current: Workout) => ({ ...current, ...patch })),
    [updateActiveWorkout],
  );

  const addExercise = useCallback(
    (exercise: Exercise): void =>
      updateActiveWorkout((current: Workout) => appendExerciseToWorkout(current, exercise)),
    [updateActiveWorkout],
  );

  const removeExercise = useCallback(
    (workoutExerciseId: string): void =>
      updateActiveWorkout((current: Workout) =>
        removeExerciseFromWorkout(current, workoutExerciseId),
      ),
    [updateActiveWorkout],
  );

  const addSet = useCallback(
    (workoutExerciseId: string): void =>
      updateActiveWorkout((current: Workout) =>
        mapWorkoutExercise(current, workoutExerciseId, appendSetToExercise),
      ),
    [updateActiveWorkout],
  );

  const updateSet = useCallback(
    (workoutExerciseId: string, setId: string, patch: Partial<WorkoutSet>): void =>
      updateActiveWorkout((current: Workout) =>
        updateWorkoutSet(current, workoutExerciseId, setId, patch),
      ),
    [updateActiveWorkout],
  );

  const removeSet = useCallback(
    (workoutExerciseId: string, setId: string): void =>
      updateActiveWorkout((current: Workout) =>
        removeWorkoutSet(current, workoutExerciseId, setId),
      ),
    [updateActiveWorkout],
  );

  const deleteWorkout = useCallback(
    (workoutId: string): void =>
      setWorkouts((workoutList: Workout[]) =>
        workoutList.filter((workout: Workout) => workout.id !== workoutId),
      ),
    [setWorkouts],
  );

  const storeActions = useMemo(
    () => ({
      updateProfile,
      startWorkout,
      discardWorkout,
      finishWorkout,
      togglePause,
      updateActive,
      addExercise,
      removeExercise,
      addSet,
      updateSet,
      removeSet,
      deleteWorkout,
    }),
    [
      updateProfile,
      startWorkout,
      discardWorkout,
      finishWorkout,
      togglePause,
      updateActive,
      addExercise,
      removeExercise,
      addSet,
      updateSet,
      removeSet,
      deleteWorkout,
    ],
  );

  const value = useMemo<Store>(
    () => ({ ready, profile, workouts, active, ...storeActions }),
    [ready, profile, workouts, active, storeActions],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore(): Store {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }
  return context;
}
