import { router } from 'expo-router';
import { useCallback } from 'react';
import { ExerciseCatalog } from '@/components/ExerciseCatalog';
import type { Exercise } from '@/lib/types';
import { useAppStore } from '@/state/AppStore';

export default function PickExerciseScreen() {
  const { addExercise } = useAppStore();
  const pick = useCallback(
    (e: Exercise) => {
      addExercise(e);
      router.back();
    },
    [addExercise],
  );
  return <ExerciseCatalog onSelect={pick} actionIcon="add-circle" />;
}
