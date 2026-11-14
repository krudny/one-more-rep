import { router } from 'expo-router';
import type { Workout } from '@/lib/types';
import { getWorkoutStats } from '@/lib/workout/workout';
import { confirmAction, showAlert } from '@/services/dialogs/dialogs';
import { useAppStore } from '@/state/AppStore/AppStore';
import { useRoutinesStore } from '@/state/RoutinesStore/RoutinesStore';
import type { UseWorkoutDetailsScreenResult } from './useWorkoutDetailsScreen.types';

export function useWorkoutDetailsScreen(workoutId: string): UseWorkoutDetailsScreenResult {
  const { workouts, deleteWorkout } = useAppStore();
  const { saveWorkoutAsRoutine } = useRoutinesStore();

  const workout = workouts.find((entry: Workout) => entry.id === workoutId);
  const stats = workout ? getWorkoutStats(workout) : null;
  const canSaveAsRoutine = Boolean(workout && workout.exercises.length > 0);

  const handleSaveAsRoutine = (): void => {
    if (!workout || workout.exercises.length === 0) {
      return;
    }
    const createdRoutine = saveWorkoutAsRoutine(workout);
    showAlert('Routine saved', `"${createdRoutine.name}" was added to your routines.`);
  };

  const handleDelete = (): void => {
    if (!workout) {
      return;
    }
    confirmAction({
      title: 'Delete workout?',
      message: 'This cannot be undone.',
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: (): void => {
        router.back();
        deleteWorkout(workout.id);
      },
    });
  };

  return {
    workout,
    stats,
    canSaveAsRoutine,
    handleSaveAsRoutine,
    handleDelete,
  };
}
