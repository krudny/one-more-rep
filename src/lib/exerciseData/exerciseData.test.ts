/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Exercise } from '../types.ts';
import { filterExercises, getDistinctValues, normalizeExercise } from './exerciseData.ts';

const IMAGE_BASE_URL = 'https://example.com/exercises';

const RAW_RECORDS = [
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

const normalizedExercises = RAW_RECORDS.map((rawRecord: unknown) =>
  normalizeExercise(rawRecord, IMAGE_BASE_URL),
).filter((exercise: Exercise | null): exercise is Exercise => exercise !== null);

test('normalizes records and skips invalid ones', () => {
  assert.equal(normalizedExercises.length, 3);
  const benchPress = normalizedExercises[0];
  assert.deepEqual(benchPress.images, [
    `${IMAGE_BASE_URL}/Barbell_Bench_Press_-_Medium_Grip/0.jpg`,
    `${IMAGE_BASE_URL}/Barbell_Bench_Press_-_Medium_Grip/1.jpg`,
  ]);
  assert.deepEqual(benchPress.bodyParts, ['chest']);
  assert.deepEqual(benchPress.equipments, ['barbell']);
  assert.equal(normalizedExercises[2].level, null);
  assert.deepEqual(normalizedExercises[2].bodyParts, ['legs']);
});

test('filters by body part, muscle and equipment', () => {
  assert.deepEqual(
    filterExercises(normalizedExercises, { bodyPart: 'legs' }).map(
      (exercise: Exercise) => exercise.id,
    ),
    ['Barbell_Squat'],
  );
  assert.equal(filterExercises(normalizedExercises, { muscle: 'chest' }).length, 2);
  assert.deepEqual(
    filterExercises(normalizedExercises, { muscle: 'chest', equipment: 'barbell' }).map(
      (exercise: Exercise) => exercise.id,
    ),
    ['Barbell_Bench_Press_-_Medium_Grip'],
  );
});

test('search matches all words and ranks prefix matches first', () => {
  assert.deepEqual(
    filterExercises(normalizedExercises, { search: 'bench press' }).map(
      (exercise: Exercise) => exercise.id,
    ),
    ['Barbell_Bench_Press_-_Medium_Grip'],
  );
  assert.deepEqual(
    filterExercises(normalizedExercises, { search: 'squat' }).map(
      (exercise: Exercise) => exercise.id,
    ),
    ['Barbell_Squat'],
  );
  assert.equal(filterExercises(normalizedExercises, { search: 'push' })[0].id, 'Pushups');
});

test('distinct values are sorted', () => {
  assert.deepEqual(
    getDistinctValues(normalizedExercises, (exercise: Exercise) => exercise.equipments),
    ['barbell', 'body only'],
  );
});
