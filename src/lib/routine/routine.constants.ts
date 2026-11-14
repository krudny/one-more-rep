import type { RoutineValidationProblem } from './routine.types.ts';

export const MIN_SET_COUNT = 1;
export const MAX_SET_COUNT = 10;
export const DEFAULT_SET_COUNT = 3;
export const DEFAULT_ROUTINE_NAME = 'New routine';

export const RoutineValidationProblems = {
  EMPTY_NAME: 'EMPTY_NAME',
  NO_EXERCISES: 'NO_EXERCISES',
  SET_COUNT_OUT_OF_RANGE: 'SET_COUNT_OUT_OF_RANGE',
} as const;

export const ROUTINE_PROBLEM_MESSAGE: Record<RoutineValidationProblem, string> = {
  [RoutineValidationProblems.EMPTY_NAME]: 'Enter a routine name.',
  [RoutineValidationProblems.NO_EXERCISES]: 'Add at least one exercise to save the routine.',
  [RoutineValidationProblems.SET_COUNT_OUT_OF_RANGE]: `Each exercise must have between ${MIN_SET_COUNT} and ${MAX_SET_COUNT} sets.`,
};

export const MoveDirections = {
  UP: 'UP',
  DOWN: 'DOWN',
} as const;
