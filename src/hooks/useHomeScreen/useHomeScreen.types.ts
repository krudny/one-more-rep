import type { Routine, WeeklyWorkoutSummary, Workout } from '@/lib/types';

export type UseHomeScreenResult = {
  active: Workout | null;
  profileName: string;
  routines: Routine[];
  weeklySummary: WeeklyWorkoutSummary;
  lastWorkout: Workout | undefined;
  elapsedMs: number;
  handleContinueWorkout: () => void;
  handleStartEmptyWorkout: () => void;
  handleStartRoutine: (routine: Routine) => void;
  handleNewRoutine: () => void;
  handleEditRoutine: (routine: Routine) => void;
  handleViewWorkoutDetails: (workoutId: string) => void;
};
