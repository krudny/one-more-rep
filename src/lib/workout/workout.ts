import type { WeeklyWorkoutSummary, Workout, WorkoutStats } from '../types.ts';
import {
  AFTERNOON_END_HOUR,
  MILLISECONDS_PER_WEEK,
  MORNING_END_HOUR,
  WorkoutDefaultNames,
} from './workout.constants.ts';

export function getElapsedMs(
  workout: Pick<Workout, 'accumulatedMs' | 'resumedAt'>,
  nowTimestamp = Date.now(),
): number {
  const activeSegmentMs = workout.resumedAt !== null ? nowTimestamp - workout.resumedAt : 0;
  return workout.accumulatedMs + activeSegmentMs;
}

export function getWorkoutStats(workout: Workout): WorkoutStats {
  let completedSets = 0;
  let totalReps = 0;
  let totalVolume = 0;

  for (const workoutExercise of workout.exercises) {
    for (const workoutSet of workoutExercise.sets) {
      if (!workoutSet.done) {
        continue;
      }
      completedSets += 1;
      totalReps += workoutSet.reps;
      totalVolume += workoutSet.reps * workoutSet.weight;
    }
  }

  return {
    exercises: workout.exercises.length,
    sets: completedSets,
    reps: totalReps,
    volume: Math.round(totalVolume),
  };
}

export function getDefaultWorkoutName(timestamp: number): string {
  const hour = new Date(timestamp).getHours();
  if (hour < MORNING_END_HOUR) {
    return WorkoutDefaultNames.MORNING;
  }
  if (hour < AFTERNOON_END_HOUR) {
    return WorkoutDefaultNames.AFTERNOON;
  }
  return WorkoutDefaultNames.EVENING;
}

export function getWeeklyWorkoutSummary(
  workouts: Workout[],
  nowTimestamp = Date.now(),
): WeeklyWorkoutSummary {
  const weekCutoffTimestamp = nowTimestamp - MILLISECONDS_PER_WEEK;
  const recentWorkouts = workouts.filter(
    (workout: Workout) => workout.startedAt >= weekCutoffTimestamp,
  );

  let totalDurationMs = 0;
  let totalCalories = 0;
  for (const workout of recentWorkouts) {
    totalDurationMs += workout.durationMs;
    totalCalories += workout.calories;
  }

  return {
    count: recentWorkouts.length,
    durationMs: totalDurationMs,
    calories: totalCalories,
  };
}
