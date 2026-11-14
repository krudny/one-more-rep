import { router } from 'expo-router';
import { useCallback, type ReactElement } from 'react';
import { ExerciseCatalog } from '@/components/ExerciseCatalog/ExerciseCatalog';
import { CatalogActionIcons } from '@/components/ExerciseRow/ExerciseRow.constants';
import type { Exercise } from '@/lib/types';
import { useAppStore } from '@/state/AppStore/AppStore';
import { useRoutineDraft } from '@/state/RoutineDraft/RoutineDraft';
import { PickExerciseTargets } from './PickExerciseScreenView.constants';
import type { PickExerciseScreenViewProps } from './PickExerciseScreenView.types';

export function PickExerciseScreenView({ target }: PickExerciseScreenViewProps): ReactElement {
  const { addExercise: addWorkoutExercise } = useAppStore();
  const { addExercise: addRoutineDraftExercise } = useRoutineDraft();

  const handlePickExercise = useCallback(
    (exercise: Exercise): void => {
      if (target === PickExerciseTargets.ROUTINE) {
        addRoutineDraftExercise(exercise);
      } else {
        addWorkoutExercise(exercise);
      }
      router.back();
    },
    [addRoutineDraftExercise, addWorkoutExercise, target],
  );

  return (
    <ExerciseCatalog onSelect={handlePickExercise} actionIcon={CatalogActionIcons.ADD_CIRCLE} />
  );
}
