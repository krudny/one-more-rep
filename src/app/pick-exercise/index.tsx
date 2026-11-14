import { router } from 'expo-router';
import { useCallback, type ReactElement } from 'react';
import { ExerciseCatalog } from '@/components/ExerciseCatalog/ExerciseCatalog';
import { CatalogActionIcons } from '@/components/ExerciseRow/ExerciseRow.constants';
import type { Exercise } from '@/lib/types';
import { useAppStore } from '@/state/AppStore/AppStore';

export default function PickExerciseScreen(): ReactElement {
  const { addExercise } = useAppStore();
  const handlePickExercise = useCallback(
    (exercise: Exercise): void => {
      addExercise(exercise);
      router.back();
    },
    [addExercise],
  );

  return (
    <ExerciseCatalog onSelect={handlePickExercise} actionIcon={CatalogActionIcons.ADD_CIRCLE} />
  );
}
