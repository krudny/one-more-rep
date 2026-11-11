import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { estimateWorkoutCalories } from '@/lib/calories';
import { defaultWorkoutName, elapsedMs } from '@/lib/workout';
import { uid } from '@/lib/format';
import type { Exercise, Profile, Workout, WorkoutExercise, WorkoutSet } from '@/lib/types';
import { StorageKeys, loadJson, saveJson } from '@/services/storage';

export const DEFAULT_PROFILE: Profile = {
  name: '',
  weightKg: 75,
  defaultIntensity: 'moderate',
  restSeconds: 90,
  autoStartRest: true,
  restSound: true,
  restVibration: true,
};

type Store = {
  ready: boolean;
  profile: Profile;
  workouts: Workout[];
  active: Workout | null;

  updateProfile: (patch: Partial<Profile>) => void;

  startWorkout: () => void;
  discardWorkout: () => void;
  finishWorkout: () => Workout | null;
  togglePause: () => void;
  updateActive: (patch: Partial<Pick<Workout, 'name' | 'intensity'>>) => void;

  addExercise: (exercise: Exercise) => void;
  removeExercise: (workoutExerciseId: string) => void;
  addSet: (workoutExerciseId: string) => void;
  updateSet: (workoutExerciseId: string, setId: string, patch: Partial<WorkoutSet>) => void;
  removeSet: (workoutExerciseId: string, setId: string) => void;

  deleteWorkout: (id: string) => void;
};

const StoreContext = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [active, setActive] = useState<Workout | null>(null);

  // Hydrate from local storage.
  useEffect(() => {
    (async () => {
      const [p, w, a] = await Promise.all([
        loadJson<Profile>(StorageKeys.profile),
        loadJson<Workout[]>(StorageKeys.workouts),
        loadJson<Workout>(StorageKeys.activeWorkout),
      ]);
      if (p) setProfile({ ...DEFAULT_PROFILE, ...p });
      if (Array.isArray(w)) setWorkouts(w);
      if (a) setActive(a);
      setReady(true);
    })();
  }, []);

  // Persist after hydration.
  useEffect(() => {
    if (ready) saveJson(StorageKeys.profile, profile);
  }, [ready, profile]);
  useEffect(() => {
    if (ready) saveJson(StorageKeys.workouts, workouts);
  }, [ready, workouts]);
  useEffect(() => {
    if (ready) saveJson(StorageKeys.activeWorkout, active);
  }, [ready, active]);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((p) => ({ ...p, ...patch }));
  }, []);

  const startWorkout = useCallback(() => {
    setActive((cur) => {
      if (cur) return cur;
      const now = Date.now();
      return {
        id: uid(),
        name: defaultWorkoutName(now),
        startedAt: now,
        accumulatedMs: 0,
        resumedAt: now,
        intensity: profile.defaultIntensity,
        exercises: [],
      };
    });
  }, [profile.defaultIntensity]);

  const discardWorkout = useCallback(() => setActive(null), []);

  const finishWorkout = useCallback((): Workout | null => {
    if (!active) return null;
    const now = Date.now();
    const durationMs = elapsedMs(active, now);
    const finished: Workout = {
      ...active,
      // Drop exercises with no sets at all.
      exercises: active.exercises.filter((e) => e.sets.length > 0),
      endedAt: now,
      accumulatedMs: durationMs,
      resumedAt: null,
      durationMs,
      bodyWeightKg: profile.weightKg,
      calories: estimateWorkoutCalories(active.intensity, profile.weightKg, durationMs),
    };
    setWorkouts((list) => [finished, ...list]);
    setActive(null);
    return finished;
  }, [active, profile.weightKg]);

  const togglePause = useCallback(() => {
    setActive((w) => {
      if (!w) return w;
      const now = Date.now();
      return w.resumedAt != null
        ? { ...w, accumulatedMs: w.accumulatedMs + (now - w.resumedAt), resumedAt: null }
        : { ...w, resumedAt: now };
    });
  }, []);

  const updateActive = useCallback((patch: Partial<Pick<Workout, 'name' | 'intensity'>>) => {
    setActive((w) => (w ? { ...w, ...patch } : w));
  }, []);

  const mapExercise = useCallback(
    (weId: string, fn: (e: WorkoutExercise) => WorkoutExercise) =>
      setActive((w) => (w ? { ...w, exercises: w.exercises.map((e) => (e.id === weId ? fn(e) : e)) } : w)),
    [],
  );

  const addExercise = useCallback((exercise: Exercise) => {
    setActive((w) => {
      if (!w) return w;
      const entry: WorkoutExercise = {
        id: uid(),
        exerciseId: exercise.id,
        name: exercise.name,
        bodyPart: exercise.bodyParts[0],
        target: exercise.targetMuscles[0],
        equipment: exercise.equipments[0],
        sets: [{ id: uid(), reps: 0, weight: 0, done: false }],
      };
      return { ...w, exercises: [...w.exercises, entry] };
    });
  }, []);

  const removeExercise = useCallback((weId: string) => {
    setActive((w) => (w ? { ...w, exercises: w.exercises.filter((e) => e.id !== weId) } : w));
  }, []);

  const addSet = useCallback(
    (weId: string) =>
      mapExercise(weId, (e) => {
        // New sets copy the previous set, which is what you want most of the time.
        const last = e.sets[e.sets.length - 1];
        return {
          ...e,
          sets: [...e.sets, { id: uid(), reps: last?.reps ?? 0, weight: last?.weight ?? 0, done: false }],
        };
      }),
    [mapExercise],
  );

  const updateSet = useCallback(
    (weId: string, setId: string, patch: Partial<WorkoutSet>) =>
      mapExercise(weId, (e) => ({ ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)) })),
    [mapExercise],
  );

  const removeSet = useCallback(
    (weId: string, setId: string) =>
      mapExercise(weId, (e) => ({ ...e, sets: e.sets.filter((s) => s.id !== setId) })),
    [mapExercise],
  );

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts((list) => list.filter((w) => w.id !== id));
  }, []);

  const value = useMemo<Store>(
    () => ({
      ready,
      profile,
      workouts,
      active,
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
      ready,
      profile,
      workouts,
      active,
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

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useAppStore must be used inside AppStoreProvider');
  return ctx;
}
