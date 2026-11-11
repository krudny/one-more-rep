export type Exercise = {
  id: string;
  name: string;
  /** Demo images (start / end position). */
  images: string[];
  bodyParts: string[];
  targetMuscles: string[];
  secondaryMuscles: string[];
  equipments: string[];
  instructions: string[];
  category?: string;
  level?: string;
};

export type Intensity = 'light' | 'moderate' | 'vigorous';

export type WorkoutSet = {
  id: string;
  reps: number;
  weight: number;
  done: boolean;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  /** Snapshot of exercise data, so history works without the catalog cache. */
  name: string;
  bodyPart?: string;
  target?: string;
  equipment?: string;
  sets: WorkoutSet[];
};

export type Workout = {
  id: string;
  name: string;
  startedAt: number;
  endedAt?: number;
  /** Time accumulated before the current run segment (pauses excluded). */
  accumulatedMs: number;
  /** Timestamp of the current run segment start, or null when paused. */
  resumedAt: number | null;
  intensity: Intensity;
  exercises: WorkoutExercise[];
  /** Body weight used for the calorie estimate (kg). */
  bodyWeightKg?: number;
  calories?: number;
  durationMs?: number;
};

export type Profile = {
  name: string;
  weightKg: number;
  defaultIntensity: Intensity;
  restSeconds: number;
  autoStartRest: boolean;
  restSound: boolean;
  restVibration: boolean;
};
