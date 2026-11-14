import type { MoveDirections, RoutineValidationProblems } from './routine.constants.ts';

export type RoutineValidationProblem =
  (typeof RoutineValidationProblems)[keyof typeof RoutineValidationProblems];

export type MoveDirection = (typeof MoveDirections)[keyof typeof MoveDirections];
