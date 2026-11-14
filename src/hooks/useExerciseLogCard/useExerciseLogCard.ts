import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import type { WorkoutExercise, WorkoutSet } from '@/lib/types';
import { useAppStore } from '@/state/AppStore/AppStore';
import { useRestTimer } from '@/state/RestTimer/RestTimer';
import type { UseExerciseLogCardResult } from './useExerciseLogCard.types';

export function useExerciseLogCard(entry: WorkoutExercise): UseExerciseLogCardResult {
  const { profile, addSet, updateSet, removeSet, removeExercise } = useAppStore();
  const restTimer = useRestTimer();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedSet =
    entry.sets.find((workoutSet: WorkoutSet) => workoutSet.id === selectedId) ??
    entry.sets.find((workoutSet: WorkoutSet) => !workoutSet.done) ??
    null;
  const selectedIndex = selectedSet ? entry.sets.indexOf(selectedSet) : -1;

  const completeSelectedSet = (): void => {
    if (!selectedSet) {
      return;
    }
    updateSet(entry.id, selectedSet.id, { done: true });
    setSelectedId(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (profile.autoStartRest) {
      restTimer.start();
    }
  };

  return {
    selectedSet,
    selectedIndex,
    selectSet: setSelectedId,
    completeSelectedSet,
    handleAddSet: (): void => addSet(entry.id),
    handleUpdateSet: (setId: string, patch: Partial<WorkoutSet>): void =>
      updateSet(entry.id, setId, patch),
    handleRemoveSet: (setId: string): void => removeSet(entry.id, setId),
    handleRemoveExercise: (): void => removeExercise(entry.id),
  };
}
