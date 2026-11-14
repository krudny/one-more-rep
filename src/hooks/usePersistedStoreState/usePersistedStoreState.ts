import { useEffect, useState } from 'react';
import type { Profile, Workout } from '@/lib/types';
import { loadJson, saveJson } from '@/services/storage/storage';
import { StorageKeys } from '@/services/storage/storage.constants';
import { DEFAULT_PROFILE } from '@/state/AppStore/AppStore.constants';
import type { PersistedStoreState } from './usePersistedStoreState.types';

export function usePersistedStoreState(): PersistedStoreState {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [active, setActive] = useState<Workout | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      const [storedProfile, storedWorkouts, storedActiveWorkout] = await Promise.all([
        loadJson<Profile>(StorageKeys.PROFILE),
        loadJson<Workout[]>(StorageKeys.WORKOUTS),
        loadJson<Workout>(StorageKeys.ACTIVE_WORKOUT),
      ]);
      if (storedProfile) setProfile({ ...DEFAULT_PROFILE, ...storedProfile });
      if (Array.isArray(storedWorkouts)) setWorkouts(storedWorkouts);
      if (storedActiveWorkout) setActive(storedActiveWorkout);
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (ready) saveJson(StorageKeys.PROFILE, profile);
  }, [ready, profile]);
  useEffect(() => {
    if (ready) saveJson(StorageKeys.WORKOUTS, workouts);
  }, [ready, workouts]);
  useEffect(() => {
    if (ready) saveJson(StorageKeys.ACTIVE_WORKOUT, active);
  }, [ready, active]);

  return { ready, profile, setProfile, workouts, setWorkouts, active, setActive };
}
