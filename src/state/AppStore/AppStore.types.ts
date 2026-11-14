import type { ReactNode } from 'react';
import type { Exercise, Profile, Workout, WorkoutSet } from '@/lib/types';

export type AppStoreProviderProps = {
  children: ReactNode;
};

export type Store = {
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

  deleteWorkout: (workoutId: string) => void;
};
