/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateCalories, estimateWorkoutCalories } from './calories.ts';
import { formatCountdown, formatDuration } from './format.ts';
import { elapsedMs, workoutStats } from './workout.ts';

test('MET formula: MET x kg x hours', () => {
  assert.equal(estimateCalories(5, 80, 3_600_000), 400);
  assert.equal(estimateCalories(6, 70, 30 * 60_000), 210);
});

test('invalid inputs give 0', () => {
  assert.equal(estimateCalories(5, 0, 3_600_000), 0);
  assert.equal(estimateCalories(5, 80, -1), 0);
  assert.equal(estimateCalories(Number.NaN, 80, 1000), 0);
});

test('intensity maps to MET', () => {
  assert.equal(estimateWorkoutCalories('light', 100, 3_600_000), 350);
  assert.equal(estimateWorkoutCalories('vigorous', 100, 3_600_000), 600);
});

test('duration formatting', () => {
  assert.equal(formatDuration(75_000), '01:15');
  assert.equal(formatDuration(3_725_000), '1:02:05');
  assert.equal(formatCountdown(500), '00:01');
  assert.equal(formatCountdown(0), '00:00');
});

test('elapsed time excludes pauses', () => {
  assert.equal(elapsedMs({ accumulatedMs: 1000, resumedAt: null }, 99_999), 1000);
  assert.equal(elapsedMs({ accumulatedMs: 1000, resumedAt: 5000 }, 8000), 4000);
});

test('stats count only completed sets', () => {
  const stats = workoutStats({
    id: 'w',
    name: 'w',
    startedAt: 0,
    accumulatedMs: 0,
    resumedAt: null,
    intensity: 'moderate',
    exercises: [
      {
        id: 'e',
        exerciseId: 'x',
        name: 'Bench',
        sets: [
          { id: '1', reps: 10, weight: 50, done: true },
          { id: '2', reps: 8, weight: 60, done: false },
        ],
      },
    ],
  });
  assert.deepEqual(stats, { exercises: 1, sets: 1, reps: 10, volume: 500 });
});
