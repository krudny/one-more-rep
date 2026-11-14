import type { PickExerciseTargets } from './PickExerciseScreenView.constants';

export type PickExerciseTarget = (typeof PickExerciseTargets)[keyof typeof PickExerciseTargets];

export type PickExerciseScreenViewProps = {
  target?: string;
};
