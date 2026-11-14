import type { Intensity, Workout } from '@/lib/types';

export type UseWorkoutScreenResult = {
  active: Workout | null;
  bodyWeightKg: number;
  elapsedMs: number;
  paused: boolean;
  estimatedCalories: number;
  togglePause: () => void;
  updateName: (name: string) => void;
  updateIntensity: (intensity: Intensity) => void;
  handleFinishWorkout: () => void;
  handleDiscardWorkout: () => void;
};
