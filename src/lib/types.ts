import type { Intensities } from './calories/calories.constants.ts';

export type Intensity = (typeof Intensities)[keyof typeof Intensities];

export type Exercise = {
  id: string;
  name: string;
  images: string[]; // Demo images (start / end position)
  bodyParts: string[];
  targetMuscles: string[];
  secondaryMuscles: string[];
  equipments: string[];
  instructions: string[];
  category: string | null;
  level: string | null;
};

export type WorkoutSet = {
  id: string;
  reps: number;
  weight: number;
  done: boolean;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  name: string; // Snapshot of exercise name so history works offline
  bodyPart: string | null;
  target: string | null;
  equipment: string | null;
  sets: WorkoutSet[];
};

export type Workout = {
  id: string;
  name: string;
  routineId?: string;
  startedAt: number;
  endedAt: number | null;
  accumulatedMs: number; // Elapsed time before current segment (excludes pauses)
  resumedAt: number | null; // Current segment start timestamp, or null when paused
  intensity: Intensity;
  exercises: WorkoutExercise[];
  bodyWeightKg: number | null;
  calories: number;
  durationMs: number;
};

export type RoutineExercise = {
  id: string;
  exerciseId: string;
  name: string; // Snapshot of exercise name so routines work offline
  bodyPart: string | null;
  target: string | null;
  equipment: string | null;
  setCount: number;
};

export type Routine = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  exercises: RoutineExercise[];
};

export type RoutineDraft = {
  name: string;
  exercises: RoutineExercise[];
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

export type WorkoutStats = {
  exercises: number;
  sets: number;
  reps: number;
  volume: number;
};

export type WeeklyWorkoutSummary = {
  count: number;
  durationMs: number;
  calories: number;
};
