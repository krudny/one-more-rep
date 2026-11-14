/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Intensities } from '../calories/calories.constants.ts';
import {
  appendExerciseToWorkout,
  appendSetToExercise,
  buildFinishedWorkout,
  createNewWorkout,
  removeExerciseFromWorkout,
  removeWorkoutSet,
  toggleWorkoutPause,
  updateWorkoutSet,
} from './workoutMutations.ts';

test('createNewWorkout starts running with default intensity', () => {
  const workout = createNewWorkout(Intensities.MODERATE);
  assert.equal(workout.intensity, Intensities.MODERATE);
  assert.equal(workout.accumulatedMs, 0);
  assert.ok(workout.resumedAt !== null);
  assert.equal(workout.exercises.length, 0);
});

test('toggleWorkoutPause pauses and resumes workout', () => {
  const runningWorkout = createNewWorkout(Intensities.LIGHT);
  const pausedWorkout = toggleWorkoutPause(runningWorkout);
  assert.equal(pausedWorkout.resumedAt, null);
  const resumedWorkout = toggleWorkoutPause(pausedWorkout);
  assert.ok(resumedWorkout.resumedAt !== null);
});

test('appendExerciseToWorkout and appendSetToExercise copy previous set', () => {
  const workout = createNewWorkout(Intensities.MODERATE);
  const withExercise = appendExerciseToWorkout(workout, {
    id: 'bench',
    name: 'Bench Press',
    images: [],
    bodyParts: ['chest'],
    targetMuscles: ['chest'],
    secondaryMuscles: [],
    equipments: ['barbell'],
    instructions: [],
    category: null,
    level: null,
  });
  assert.equal(withExercise.exercises.length, 1);

  const firstExercise = withExercise.exercises[0];
  firstExercise.sets[0] = { id: 'set-1', reps: 10, weight: 60, done: true };
  const updatedExercise = appendSetToExercise(firstExercise);
  assert.equal(updatedExercise.sets.length, 2);
  assert.equal(updatedExercise.sets[1].reps, 10);
  assert.equal(updatedExercise.sets[1].weight, 60);
  assert.equal(updatedExercise.sets[1].done, false);
});

test('buildFinishedWorkout drops empty exercises and computes totals', () => {
  const workout = createNewWorkout(Intensities.VIGOROUS);
  workout.exercises = [
    {
      id: 'empty',
      exerciseId: 'a',
      name: 'A',
      bodyPart: null,
      target: null,
      equipment: null,
      sets: [],
    },
    {
      id: 'valid',
      exerciseId: 'b',
      name: 'B',
      bodyPart: null,
      target: null,
      equipment: null,
      sets: [{ id: 's1', reps: 8, weight: 50, done: true }],
    },
  ];
  const finishedWorkout = buildFinishedWorkout(workout, 80);
  assert.equal(finishedWorkout.exercises.length, 1);
  assert.equal(finishedWorkout.exercises[0].id, 'valid');
  assert.equal(finishedWorkout.resumedAt, null);
  assert.equal(finishedWorkout.bodyWeightKg, 80);
});

test('updateWorkoutSet, removeWorkoutSet and removeExerciseFromWorkout mutate target entries', () => {
  const workout = createNewWorkout(Intensities.MODERATE);
  workout.exercises = [
    {
      id: 'ex-1',
      exerciseId: 'bench',
      name: 'Bench',
      bodyPart: null,
      target: null,
      equipment: null,
      sets: [
        { id: 'set-1', reps: 10, weight: 60, done: false },
        { id: 'set-2', reps: 8, weight: 70, done: false },
      ],
    },
  ];

  const updated = updateWorkoutSet(workout, 'ex-1', 'set-1', { done: true, reps: 12 });
  assert.equal(updated.exercises[0].sets[0].done, true);
  assert.equal(updated.exercises[0].sets[0].reps, 12);

  const afterSetRemove = removeWorkoutSet(updated, 'ex-1', 'set-2');
  assert.equal(afterSetRemove.exercises[0].sets.length, 1);

  const afterExerciseRemove = removeExerciseFromWorkout(afterSetRemove, 'ex-1');
  assert.equal(afterExerciseRemove.exercises.length, 0);
});
