import { router } from 'expo-router';
import { useNow } from '@/hooks/useNow/useNow';
import type { Routine } from '@/lib/types';
import { getElapsedMs, getWeeklyWorkoutSummary } from '@/lib/workout/workout';
import { confirmAction } from '@/services/dialogs/dialogs';
import { useAppStore } from '@/state/AppStore/AppStore';
import { useRoutinesStore } from '@/state/RoutinesStore/RoutinesStore';
import { HOME_CLOCK_INTERVAL_MS } from '@/views/HomeScreenView/HomeScreenView.constants';
import type { UseHomeScreenResult } from './useHomeScreen.types';

export function useHomeScreen(): UseHomeScreenResult {
  const { active, workouts, profile, startEmptyWorkout, startWorkoutFromRoutine } = useAppStore();
  const { routines } = useRoutinesStore();
  const nowTimestamp = useNow(HOME_CLOCK_INTERVAL_MS, active !== null);

  const weeklySummary = getWeeklyWorkoutSummary(workouts);
  const lastWorkout = workouts[0];
  const elapsedMs = active ? getElapsedMs(active, nowTimestamp) : 0;

  const showActiveWorkoutAlert = (): void => {
    confirmAction({
      title: 'A workout is already in progress',
      message: 'Finish or discard your current workout before starting a new one.',
      confirmText: 'Continue',
      cancelText: 'Cancel',
      onConfirm: (): void => {
        router.push('/workout');
      },
    });
  };

  const handleStartEmptyWorkout = (): void => {
    if (startEmptyWorkout()) {
      router.push('/workout');
      return;
    }
    showActiveWorkoutAlert();
  };

  const handleStartRoutine = (routine: Routine): void => {
    if (startWorkoutFromRoutine(routine)) {
      router.push('/workout');
      return;
    }
    showActiveWorkoutAlert();
  };

  return {
    active,
    profileName: profile.name,
    routines,
    weeklySummary,
    lastWorkout,
    elapsedMs,
    handleContinueWorkout: (): void => router.push('/workout'),
    handleStartEmptyWorkout,
    handleStartRoutine,
    handleNewRoutine: (): void => router.push('/routine-editor'),
    handleEditRoutine: (routine: Routine): void => router.push(`/routine-editor?id=${routine.id}`),
    handleViewWorkoutDetails: (workoutId: string): void => router.push(`/history/${workoutId}`),
  };
}
