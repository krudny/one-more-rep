import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useNow } from '@/hooks/useNow/useNow';
import { estimateWorkoutCalories } from '@/lib/calories/calories';
import type { Intensity, WorkoutExercise } from '@/lib/types';
import { getElapsedMs } from '@/lib/workout/workout';
import { areAllWorkoutSetsDone } from '@/lib/workoutMutations/workoutMutations';
import { confirmAction } from '@/services/dialogs/dialogs';
import { useAppStore } from '@/state/AppStore/AppStore';
import { useRestTimer } from '@/state/RestTimer/RestTimer';
import { WORKOUT_CLOCK_INTERVAL_MS } from './useWorkoutScreen.constants';
import type { UseWorkoutScreenResult } from './useWorkoutScreen.types';

export function useWorkoutScreen(): UseWorkoutScreenResult {
  const { active, profile, togglePause, updateActive, finishWorkout, discardWorkout } =
    useAppStore();
  const restTimer = useRestTimer();
  const isRunning = active !== null && active.resumedAt !== null;
  const nowTimestamp = useNow(WORKOUT_CLOCK_INTERVAL_MS, isRunning);
  const finishingRef = useRef(false);

  useEffect(() => {
    if (!active && !finishingRef.current) {
      router.back();
    }
  }, [active]);

  const elapsedMs = active ? getElapsedMs(active, nowTimestamp) : 0;
  const paused = !isRunning;
  const estimatedCalories = active
    ? estimateWorkoutCalories(active.intensity, profile.weightKg, elapsedMs)
    : 0;

  const completeAndSaveWorkout = (): void => {
    restTimer.stop();
    finishingRef.current = true;
    const savedWorkout = finishWorkout();
    if (savedWorkout) {
      router.replace(`/history/${savedWorkout.id}`);
    }
  };

  const handleFinishWorkout = (): void => {
    if (!active) {
      return;
    }

    const hasLoggableExercises = active.exercises.some(
      (workoutExercise: WorkoutExercise) => workoutExercise.sets.length > 0,
    );

    if (!hasLoggableExercises) {
      confirmAction({
        title: 'Nothing to save',
        message: 'Add at least one exercise before finishing, or discard this workout.',
        confirmText: 'Discard',
        cancelText: 'Keep going',
        isDestructive: true,
        onConfirm: (): void => {
          restTimer.stop();
          discardWorkout();
        },
      });
      return;
    }

    if (!areAllWorkoutSetsDone(active)) {
      confirmAction({
        title: 'Some sets are not done',
        message: 'Unchecked sets will be saved as skipped. Finish anyway?',
        confirmText: 'Finish anyway',
        cancelText: 'Cancel',
        onConfirm: completeAndSaveWorkout,
      });
      return;
    }

    confirmAction({
      title: 'Finish workout?',
      message: 'Your workout will be saved to history.',
      confirmText: 'Finish',
      cancelText: 'Cancel',
      onConfirm: completeAndSaveWorkout,
    });
  };

  const handleDiscardWorkout = (): void => {
    confirmAction({
      title: 'Discard workout?',
      message: 'This workout will not be saved.',
      confirmText: 'Discard',
      isDestructive: true,
      onConfirm: (): void => {
        restTimer.stop();
        discardWorkout();
      },
    });
  };

  return {
    active,
    bodyWeightKg: profile.weightKg,
    elapsedMs,
    paused,
    estimatedCalories,
    togglePause,
    updateName: (name: string): void => updateActive({ name }),
    updateIntensity: (intensity: Intensity): void => updateActive({ intensity }),
    handleFinishWorkout,
    handleDiscardWorkout,
  };
}
