/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distinctValues, filterExercises, normalizeExercise } from './exerciseData.ts';
import type { Exercise } from './types.ts';

const BASE = 'https://example.com/exercises';

// Records in the free-exercise-db format.
const raw = [
  {
    id: 'Barbell_Bench_Press_-_Medium_Grip',
    name: 'Barbell Bench Press - Medium Grip',
    level: 'beginner',
    equipment: 'barbell',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    instructions: ['Lie back on a flat bench.'],
    category: 'strength',
    images: ['Barbell_Bench_Press_-_Medium_Grip/0.jpg', 'Barbell_Bench_Press_-_Medium_Grip/1.jpg'],
  },
  {
    id: 'Pushups',
    name: 'Pushups',
    level: 'beginner',
    equipment: 'body only',
    primaryMuscles: ['chest'],
    secondaryMuscles: [],
    instructions: [],
    category: 'strength',
    images: [],
  },
  {
    id: 'Barbell_Squat',
    name: 'Barbell Squat',
    equipment: 'barbell',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['glutes'],
    instructions: [],
    category: 'strength',
    images: ['Barbell_Squat/0.jpg'],
  },
  { id: 'broken' },
];

const all = raw.map((r) => normalizeExercise(r, BASE)).filter((e): e is Exercise => e !== null);

test('normalizes records and skips invalid ones', () => {
  assert.equal(all.length, 3);
  const bench = all[0];
  assert.deepEqual(bench.images, [
    `${BASE}/Barbell_Bench_Press_-_Medium_Grip/0.jpg`,
    `${BASE}/Barbell_Bench_Press_-_Medium_Grip/1.jpg`,
  ]);
  assert.deepEqual(bench.bodyParts, ['chest']);
  assert.deepEqual(bench.equipments, ['barbell']);
  assert.deepEqual(all[2].bodyParts, ['legs']);
});

test('filters by body part, muscle and equipment', () => {
  assert.deepEqual(filterExercises(all, { bodyPart: 'legs' }).map((e) => e.id), ['Barbell_Squat']);
  assert.equal(filterExercises(all, { muscle: 'chest' }).length, 2);
  assert.deepEqual(
    filterExercises(all, { muscle: 'chest', equipment: 'barbell' }).map((e) => e.id),
    ['Barbell_Bench_Press_-_Medium_Grip'],
  );
});

test('search matches all words and ranks prefix matches first', () => {
  assert.deepEqual(filterExercises(all, { search: 'bench press' }).map((e) => e.id), ['Barbell_Bench_Press_-_Medium_Grip']);
  assert.deepEqual(filterExercises(all, { search: 'squat' }).map((e) => e.id), ['Barbell_Squat']);
  assert.equal(filterExercises(all, { search: 'push' })[0].id, 'Pushups');
});

test('distinct values are sorted', () => {
  assert.deepEqual(distinctValues(all, (e) => e.equipments), ['barbell', 'body only']);
});
