import { useEffect, useState } from 'react';
import type { Exercise } from '@/lib/types';
import { getExercise } from '@/services/exerciseApi/exerciseApi';
import type { UseExerciseResult } from './useExercise.types';

export function useExercise(exerciseId: string, shouldLoad = true): UseExerciseResult {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldLoad) {
      return;
    }
    let cancelled = false;
    setError(null);
    getExercise(exerciseId)
      .then((loadedExercise: Exercise) => {
        if (!cancelled) {
          setExercise(loadedExercise);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Could not load exercise');
        }
      });
    return (): void => {
      cancelled = true;
    };
  }, [exerciseId, shouldLoad]);

  return { exercise, error };
}
