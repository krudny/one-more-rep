import type { Dispatch, SetStateAction } from 'react';
import type { Profile, Workout } from '@/lib/types';

export type PersistedStoreState = {
  ready: boolean;
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  workouts: Workout[];
  setWorkouts: Dispatch<SetStateAction<Workout[]>>;
  active: Workout | null;
  setActive: Dispatch<SetStateAction<Workout | null>>;
};
