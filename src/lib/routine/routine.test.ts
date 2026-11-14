/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Intensities } from '../calories/calories.constants.ts';
import type { Exercise, Routine, Workout } from '../types.ts';
import {
  areRoutineDraftsEqual,
  clampSetCount,
  createRoutineExercise,
  createRoutineFromDraft,
  createRoutineFromWorkout,
  createWorkoutFromRoutine,
  getRoutineTotalSets,
  moveRoutineExercise,
  reorderRoutineExercises,
  updateRoutineFromDraft,
  validateRoutine,
} from './routine.ts';
import {
  DEFAULT_SET_COUNT,
  MAX_SET_COUNT,
  MIN_SET_COUNT,
  MoveDirections,
  RoutineValidationProblems,
} from './routine.constants.ts';

const SAMPLE_EXERCISE: Exercise = {
  id: 'barbell-bench-press',
  name: 'Barbell Bench Press',
  images: [],
  bodyParts: ['chest'],
  targetMuscles: ['pectorals'],
  secondaryMuscles: ['triceps'],
  equipments: ['barbell'],
  instructions: [],
  category: 'strength',
  level: 'intermediate',
};

test('validateRoutine detects empty name, no exercises, and invalid set count', () => {
  const emptyDraftProblems = validateRoutine({ name: '   ', exercises: [] });
  assert.deepEqual(emptyDraftProblems, [
    RoutineValidationProblems.EMPTY_NAME,
    RoutineValidationProblems.NO_EXERCISES,
  ]);

  const validExercise = createRoutineExercise(SAMPLE_EXERCISE, DEFAULT_SET_COUNT);
  assert.deepEqual(validateRoutine({ name: 'Push Day', exercises: [validExercise] }), []);

  const tooFewSets = { ...validExercise, setCount: 0 };
  assert.deepEqual(validateRoutine({ name: 'Push Day', exercises: [tooFewSets] }), [
    RoutineValidationProblems.SET_COUNT_OUT_OF_RANGE,
  ]);

  const tooManySets = { ...validExercise, setCount: MAX_SET_COUNT + 1 };
  assert.deepEqual(validateRoutine({ name: 'Push Day', exercises: [tooManySets] }), [
    RoutineValidationProblems.SET_COUNT_OUT_OF_RANGE,
  ]);
});

test('clampSetCount clamps values to allowed range', () => {
  assert.equal(clampSetCount(0), MIN_SET_COUNT);
  assert.equal(clampSetCount(99), MAX_SET_COUNT);
  assert.equal(clampSetCount(4), 4);
});

test('createWorkoutFromRoutine builds running workout without mutating routine', () => {
  const firstExercise = createRoutineExercise(SAMPLE_EXERCISE, 3);
  const secondExercise = {
    ...createRoutineExercise(SAMPLE_EXERCISE, 2),
    id: 'row-entry',
    exerciseId: 'barbell-row',
    name: 'Barbell Row',
  };
  const routine: Routine = {
    id: 'routine-1',
    name: 'Upper Body',
    createdAt: 1000,
    updatedAt: 1000,
    exercises: [firstExercise, secondExercise],
  };

  const nowTimestamp = 50_000;
  const workout = createWorkoutFromRoutine(routine, nowTimestamp, Intensities.VIGOROUS);

  assert.equal(workout.name, 'Upper Body');
  assert.equal(workout.routineId, 'routine-1');
  assert.equal(workout.startedAt, nowTimestamp);
  assert.equal(workout.resumedAt, nowTimestamp);
  assert.equal(workout.accumulatedMs, 0);
  assert.equal(workout.intensity, Intensities.VIGOROUS);
  assert.equal(workout.exercises.length, 2);
  assert.equal(workout.exercises[0].exerciseId, 'barbell-bench-press');
  assert.equal(workout.exercises[0].sets.length, 3);
  assert.equal(workout.exercises[1].exerciseId, 'barbell-row');
  assert.equal(workout.exercises[1].sets.length, 2);

  for (const workoutSet of workout.exercises[0].sets) {
    assert.equal(workoutSet.reps, 0);
    assert.equal(workoutSet.weight, 0);
    assert.equal(workoutSet.done, false);
  }

  workout.exercises[0].sets[0].done = true;
  workout.exercises[0].sets[0].reps = 12;
  assert.equal(routine.exercises[0].setCount, 3);
});

test('createRoutineFromWorkout builds routine with matching exercise order and set counts', () => {
  const workout: Workout = {
    id: 'workout-1',
    name: 'Leg Day',
    startedAt: 1000,
    endedAt: 2000,
    accumulatedMs: 1000,
    resumedAt: null,
    intensity: Intensities.MODERATE,
    bodyWeightKg: 80,
    calories: 120,
    durationMs: 1000,
    exercises: [
      {
        id: 'we-1',
        exerciseId: 'squat',
        name: 'Squat',
        bodyPart: 'upper legs',
        target: 'quads',
        equipment: 'barbell',
        sets: [
          { id: 's1', reps: 5, weight: 100, done: true },
          { id: 's2', reps: 5, weight: 100, done: true },
          { id: 's3', reps: 5, weight: 100, done: false },
          { id: 's4', reps: 5, weight: 100, done: false },
        ],
      },
      {
        id: 'we-2',
        exerciseId: 'calf-raise',
        name: 'Calf Raise',
        bodyPart: 'lower legs',
        target: 'calves',
        equipment: 'machine',
        sets: [{ id: 's5', reps: 15, weight: 40, done: true }],
      },
    ],
  };

  const nowTimestamp = 9000;
  const routine = createRoutineFromWorkout(workout, nowTimestamp);

  assert.equal(routine.name, 'Leg Day');
  assert.equal(routine.createdAt, nowTimestamp);
  assert.equal(routine.updatedAt, nowTimestamp);
  assert.equal(routine.exercises.length, 2);
  assert.equal(routine.exercises[0].exerciseId, 'squat');
  assert.equal(routine.exercises[0].setCount, 4);
  assert.equal(routine.exercises[1].exerciseId, 'calf-raise');
  assert.equal(routine.exercises[1].setCount, 1);
  assert.equal(getRoutineTotalSets(routine), 5);
});

test('reorderRoutineExercises and moveRoutineExercise reorder items safely', () => {
  const first = { ...createRoutineExercise(SAMPLE_EXERCISE, 3), id: 'ex-1' };
  const second = { ...createRoutineExercise(SAMPLE_EXERCISE, 4), id: 'ex-2' };
  const third = { ...createRoutineExercise(SAMPLE_EXERCISE, 5), id: 'ex-3' };
  const list = [first, second, third];

  const movedDown = moveRoutineExercise(list, 'ex-1', MoveDirections.DOWN);
  assert.deepEqual(
    movedDown.map((item): string => item.id),
    ['ex-2', 'ex-1', 'ex-3'],
  );

  const movedUp = moveRoutineExercise(movedDown, 'ex-3', MoveDirections.UP);
  assert.deepEqual(
    movedUp.map((item): string => item.id),
    ['ex-2', 'ex-3', 'ex-1'],
  );

  const outOfBounds = moveRoutineExercise(list, 'ex-1', MoveDirections.UP);
  assert.deepEqual(
    outOfBounds.map((item): string => item.id),
    ['ex-1', 'ex-2', 'ex-3'],
  );

  const reordered = reorderRoutineExercises(list, 2, 0);
  assert.deepEqual(
    reordered.map((item): string => item.id),
    ['ex-3', 'ex-1', 'ex-2'],
  );
});

test('createRoutineFromDraft, updateRoutineFromDraft and areRoutineDraftsEqual work as expected', () => {
  const exercise = createRoutineExercise(SAMPLE_EXERCISE, 3);
  const draft = { name: '  Full Body  ', exercises: [exercise] };
  const created = createRoutineFromDraft(draft, 1000);
  assert.equal(created.name, 'Full Body');
  assert.equal(created.createdAt, 1000);

  const updatedDraft = { name: 'Full Body v2', exercises: [{ ...exercise, setCount: 5 }] };
  assert.equal(areRoutineDraftsEqual(draft, updatedDraft), false);
  assert.equal(
    areRoutineDraftsEqual(draft, { name: '  Full Body  ', exercises: [exercise] }),
    true,
  );

  const updated = updateRoutineFromDraft(created, updatedDraft, 2000);
  assert.equal(updated.id, created.id);
  assert.equal(updated.name, 'Full Body v2');
  assert.equal(updated.createdAt, 1000);
  assert.equal(updated.updatedAt, 2000);
  assert.equal(updated.exercises[0].setCount, 5);
});
