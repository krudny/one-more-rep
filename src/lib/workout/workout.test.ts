/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Intensities } from '../calories/calories.constants.ts';
import {
  getDefaultWorkoutName,
  getElapsedMs,
  getWeeklyWorkoutSummary,
  getWorkoutStats,
} from './workout.ts';
import { MILLISECONDS_PER_WEEK, WorkoutDefaultNames } from './workout.constants.ts';

test('elapsed time excludes pauses', () => {
  assert.equal(getElapsedMs({ accumulatedMs: 1000, resumedAt: null }, 99_999), 1000);
  assert.equal(getElapsedMs({ accumulatedMs: 1000, resumedAt: 5000 }, 8000), 4000);
});

test('stats count only completed sets', () => {
  const stats = getWorkoutStats({
    id: 'workout-1',
    name: 'Push day',
    startedAt: 0,
    endedAt: null,
    accumulatedMs: 0,
    resumedAt: null,
    intensity: Intensities.MODERATE,
    bodyWeightKg: null,
    calories: 0,
    durationMs: 0,
    exercises: [
      {
        id: 'exercise-entry-1',
        exerciseId: 'bench-press',
        name: 'Bench',
        bodyPart: null,
        target: null,
        equipment: null,
        sets: [
          { id: 'set-1', reps: 10, weight: 50, done: true },
          { id: 'set-2', reps: 8, weight: 60, done: false },
        ],
      },
    ],
  });
  assert.deepEqual(stats, { exercises: 1, sets: 1, reps: 10, volume: 500 });
});

test('default workout name matches time of day', () => {
  const morningTimestamp = new Date(2026, 0, 1, 9, 0, 0).getTime();
  const afternoonTimestamp = new Date(2026, 0, 1, 14, 0, 0).getTime();
  const eveningTimestamp = new Date(2026, 0, 1, 20, 0, 0).getTime();
  assert.equal(getDefaultWorkoutName(morningTimestamp), WorkoutDefaultNames.MORNING);
  assert.equal(getDefaultWorkoutName(afternoonTimestamp), WorkoutDefaultNames.AFTERNOON);
  assert.equal(getDefaultWorkoutName(eveningTimestamp), WorkoutDefaultNames.EVENING);
});

test('weekly workout summary aggregates last 7 days', () => {
  const nowTimestamp = 1_000_000_000;
  const recentWorkout = {
    id: 'recent',
    name: 'Recent',
    startedAt: nowTimestamp - 10_000,
    endedAt: nowTimestamp,
    accumulatedMs: 1_800_000,
    resumedAt: null,
    intensity: Intensities.MODERATE,
    exercises: [],
    bodyWeightKg: 75,
    durationMs: 1_800_000,
    calories: 250,
  };
  const oldWorkout = {
    id: 'old',
    name: 'Old',
    startedAt: nowTimestamp - MILLISECONDS_PER_WEEK - 1,
    endedAt: nowTimestamp - MILLISECONDS_PER_WEEK,
    accumulatedMs: 3_600_000,
    resumedAt: null,
    intensity: Intensities.VIGOROUS,
    exercises: [],
    bodyWeightKg: 75,
    durationMs: 3_600_000,
    calories: 500,
  };

  const summary = getWeeklyWorkoutSummary([recentWorkout, oldWorkout], nowTimestamp);
  assert.deepEqual(summary, { count: 1, durationMs: 1_800_000, calories: 250 });
});
