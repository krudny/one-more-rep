import { createUid } from '../format/format.ts';
import type {
  Exercise,
  Intensity,
  Routine,
  RoutineDraft,
  RoutineExercise,
  Workout,
  WorkoutExercise,
  WorkoutSet,
} from '../types.ts';
import {
  DEFAULT_ROUTINE_NAME,
  DEFAULT_SET_COUNT,
  MAX_SET_COUNT,
  MIN_SET_COUNT,
  MoveDirections,
  RoutineValidationProblems,
} from './routine.constants.ts';
import type { MoveDirection, RoutineValidationProblem } from './routine.types.ts';

export function clampSetCount(setCount: number): number {
  return Math.min(MAX_SET_COUNT, Math.max(MIN_SET_COUNT, Math.round(setCount)));
}

export function isSetCountValid(setCount: number): boolean {
  return Number.isInteger(setCount) && setCount >= MIN_SET_COUNT && setCount <= MAX_SET_COUNT;
}

export function validateRoutine(draft: RoutineDraft): RoutineValidationProblem[] {
  const problems: RoutineValidationProblem[] = [];

  if (draft.name.trim().length === 0) {
    problems.push(RoutineValidationProblems.EMPTY_NAME);
  }

  if (draft.exercises.length === 0) {
    problems.push(RoutineValidationProblems.NO_EXERCISES);
  }

  const hasInvalidSetCount = draft.exercises.some(
    (routineExercise: RoutineExercise) => !isSetCountValid(routineExercise.setCount),
  );
  if (hasInvalidSetCount) {
    problems.push(RoutineValidationProblems.SET_COUNT_OUT_OF_RANGE);
  }

  return problems;
}

export function createRoutineExercise(
  exercise: Exercise,
  setCount = DEFAULT_SET_COUNT,
): RoutineExercise {
  return {
    id: createUid(),
    exerciseId: exercise.id,
    name: exercise.name,
    bodyPart: exercise.bodyParts[0] ?? null,
    target: exercise.targetMuscles[0] ?? null,
    equipment: exercise.equipments[0] ?? null,
    setCount: clampSetCount(setCount),
  };
}

export function reorderRoutineExercises(
  exercises: RoutineExercise[],
  fromIndex: number,
  toIndex: number,
): RoutineExercise[] {
  if (
    fromIndex < 0 ||
    fromIndex >= exercises.length ||
    toIndex < 0 ||
    toIndex >= exercises.length ||
    fromIndex === toIndex
  ) {
    return exercises;
  }
  const nextExercises = [...exercises];
  const [movedExercise] = nextExercises.splice(fromIndex, 1);
  nextExercises.splice(toIndex, 0, movedExercise);
  return nextExercises;
}

export function moveRoutineExercise(
  exercises: RoutineExercise[],
  routineExerciseId: string,
  direction: MoveDirection,
): RoutineExercise[] {
  const currentIndex = exercises.findIndex(
    (routineExercise: RoutineExercise) => routineExercise.id === routineExerciseId,
  );
  if (currentIndex === -1) {
    return exercises;
  }
  const offset = direction === MoveDirections.UP ? -1 : 1;
  return reorderRoutineExercises(exercises, currentIndex, currentIndex + offset);
}

export function getRoutineTotalSets(routine: Pick<Routine, 'exercises'>): number {
  let totalSets = 0;
  for (const routineExercise of routine.exercises) {
    totalSets += routineExercise.setCount;
  }
  return totalSets;
}

export function createRoutineFromDraft(draft: RoutineDraft, nowTimestamp: number): Routine {
  return {
    id: createUid(),
    name: draft.name.trim(),
    createdAt: nowTimestamp,
    updatedAt: nowTimestamp,
    exercises: draft.exercises.map((routineExercise: RoutineExercise): RoutineExercise => ({
      ...routineExercise,
      setCount: clampSetCount(routineExercise.setCount),
    })),
  };
}

export function updateRoutineFromDraft(
  routine: Routine,
  draft: RoutineDraft,
  nowTimestamp: number,
): Routine {
  return {
    ...routine,
    name: draft.name.trim(),
    updatedAt: nowTimestamp,
    exercises: draft.exercises.map((routineExercise: RoutineExercise): RoutineExercise => ({
      ...routineExercise,
      setCount: clampSetCount(routineExercise.setCount),
    })),
  };
}

export function areRoutineDraftsEqual(first: RoutineDraft, second: RoutineDraft): boolean {
  if (first.name !== second.name || first.exercises.length !== second.exercises.length) {
    return false;
  }
  return first.exercises.every((firstExercise: RoutineExercise, index: number) => {
    const secondExercise = second.exercises[index];
    return (
      firstExercise.id === secondExercise.id &&
      firstExercise.exerciseId === secondExercise.exerciseId &&
      firstExercise.setCount === secondExercise.setCount
    );
  });
}

export function createWorkoutFromRoutine(
  routine: Routine,
  nowTimestamp: number,
  intensity: Intensity,
): Workout {
  const exercises: WorkoutExercise[] = routine.exercises.map(
    (routineExercise: RoutineExercise): WorkoutExercise => ({
      id: createUid(),
      exerciseId: routineExercise.exerciseId,
      name: routineExercise.name,
      bodyPart: routineExercise.bodyPart,
      target: routineExercise.target,
      equipment: routineExercise.equipment,
      sets: Array.from({ length: routineExercise.setCount }, (): WorkoutSet => ({
        id: createUid(),
        reps: 0,
        weight: 0,
        done: false,
      })),
    }),
  );

  return {
    id: createUid(),
    name: routine.name,
    routineId: routine.id,
    startedAt: nowTimestamp,
    endedAt: null,
    accumulatedMs: 0,
    resumedAt: nowTimestamp,
    intensity,
    exercises,
    bodyWeightKg: null,
    calories: 0,
    durationMs: 0,
  };
}

export function createRoutineFromWorkout(workout: Workout, nowTimestamp: number): Routine {
  const trimmedName = workout.name.trim();
  const exercises: RoutineExercise[] = workout.exercises.map(
    (workoutExercise: WorkoutExercise): RoutineExercise => ({
      id: createUid(),
      exerciseId: workoutExercise.exerciseId,
      name: workoutExercise.name,
      bodyPart: workoutExercise.bodyPart,
      target: workoutExercise.target,
      equipment: workoutExercise.equipment,
      setCount: Math.max(MIN_SET_COUNT, workoutExercise.sets.length),
    }),
  );

  return {
    id: createUid(),
    name: trimmedName.length > 0 ? trimmedName : DEFAULT_ROUTINE_NAME,
    createdAt: nowTimestamp,
    updatedAt: nowTimestamp,
    exercises,
  };
}
