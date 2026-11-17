import { router } from 'expo-router';
import { useCallback, type ReactElement } from 'react';
import { ExerciseCatalog } from '@/components/ExerciseCatalog/ExerciseCatalog';
import { flags } from '@/lib/features/features';
import type { Exercise } from '@/lib/types';

export default function ExercisesScreen(): ReactElement {
  const handleSelectExercise = useCallback((exercise: Exercise): void => {
    router.push(`/exercise/${encodeURIComponent(exercise.id)}`);
  }, []);

  return <ExerciseCatalog onSelect={flags.exerciseDetails ? handleSelectExercise : null} />;
}
