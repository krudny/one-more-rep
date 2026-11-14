import { estimateWorkoutCalories } from '../calories/calories.ts';
import { createUid } from '../format/format.ts';
import type { Exercise, Workout, WorkoutExercise, WorkoutSet } from '../types.ts';
import { getDefaultWorkoutName, getElapsedMs } from '../workout/workout.ts';

export function createNewWorkout(defaultIntensity: Workout['intensity']): Workout {
  const now = Date.now();
  return {
    id: createUid(),
    name: getDefaultWorkoutName(now),
    startedAt: now,
    endedAt: null,
    accumulatedMs: 0,
    resumedAt: now,
    intensity: defaultIntensity,
    exercises: [],
    bodyWeightKg: null,
    calories: 0,
    durationMs: 0,
  };
}

export function buildFinishedWorkout(workout: Workout, bodyWeightKg: number): Workout {
  const now = Date.now();
  const durationMs = getElapsedMs(workout, now);
  return {
    ...workout,
    exercises: workout.exercises.filter(
      (workoutExercise: WorkoutExercise) => workoutExercise.sets.length > 0,
    ),
    endedAt: now,
    accumulatedMs: durationMs,
    resumedAt: null,
    durationMs,
    bodyWeightKg,
    calories: estimateWorkoutCalories(workout.intensity, bodyWeightKg, durationMs),
  };
}

export function toggleWorkoutPause(workout: Workout): Workout {
  const now = Date.now();
  if (workout.resumedAt !== null) {
    return {
      ...workout,
      accumulatedMs: workout.accumulatedMs + (now - workout.resumedAt),
      resumedAt: null,
    };
  }
  return { ...workout, resumedAt: now };
}

export function appendExerciseToWorkout(workout: Workout, exercise: Exercise): Workout {
  const entry: WorkoutExercise = {
    id: createUid(),
    exerciseId: exercise.id,
    name: exercise.name,
    bodyPart: exercise.bodyParts[0] ?? null,
    target: exercise.targetMuscles[0] ?? null,
    equipment: exercise.equipments[0] ?? null,
    sets: [{ id: createUid(), reps: 0, weight: 0, done: false }],
  };
  return { ...workout, exercises: [...workout.exercises, entry] };
}

export function mapWorkoutExercise(
  workout: Workout,
  workoutExerciseId: string,
  updater: (exercise: WorkoutExercise) => WorkoutExercise,
): Workout {
  return {
    ...workout,
    exercises: workout.exercises.map((workoutExercise: WorkoutExercise) =>
      workoutExercise.id === workoutExerciseId ? updater(workoutExercise) : workoutExercise,
    ),
  };
}

export function appendSetToExercise(workoutExercise: WorkoutExercise): WorkoutExercise {
  const lastSet = workoutExercise.sets[workoutExercise.sets.length - 1];
  const nextSet: WorkoutSet = {
    id: createUid(),
    reps: lastSet ? lastSet.reps : 0,
    weight: lastSet ? lastSet.weight : 0,
    done: false,
  };
  return { ...workoutExercise, sets: [...workoutExercise.sets, nextSet] };
}

export function removeExerciseFromWorkout(workout: Workout, workoutExerciseId: string): Workout {
  return {
    ...workout,
    exercises: workout.exercises.filter(
      (workoutExercise: WorkoutExercise) => workoutExercise.id !== workoutExerciseId,
    ),
  };
}

export function updateWorkoutSet(
  workout: Workout,
  workoutExerciseId: string,
  setId: string,
  patch: Partial<WorkoutSet>,
): Workout {
  return mapWorkoutExercise(workout, workoutExerciseId, (workoutExercise: WorkoutExercise) => ({
    ...workoutExercise,
    sets: workoutExercise.sets.map((workoutSet: WorkoutSet) =>
      workoutSet.id === setId ? { ...workoutSet, ...patch } : workoutSet,
    ),
  }));
}

export function removeWorkoutSet(
  workout: Workout,
  workoutExerciseId: string,
  setId: string,
): Workout {
  return mapWorkoutExercise(workout, workoutExerciseId, (workoutExercise: WorkoutExercise) => ({
    ...workoutExercise,
    sets: workoutExercise.sets.filter((workoutSet: WorkoutSet) => workoutSet.id !== setId),
  }));
}
