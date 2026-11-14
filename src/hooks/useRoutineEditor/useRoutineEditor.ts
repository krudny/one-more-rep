import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { validateRoutine } from '@/lib/routine/routine';
import { MoveDirections, ROUTINE_PROBLEM_MESSAGE } from '@/lib/routine/routine.constants';
import type { Routine } from '@/lib/types';
import { confirmAction } from '@/services/dialogs/dialogs';
import { useAppStore } from '@/state/AppStore/AppStore';
import { useRoutineDraft } from '@/state/RoutineDraft/RoutineDraft';
import { useRoutinesStore } from '@/state/RoutinesStore/RoutinesStore';
import { PickExerciseTargets } from '@/views/PickExerciseScreenView/PickExerciseScreenView.constants';
import type { UseRoutineEditorResult } from './useRoutineEditor.types';

export function useRoutineEditor(routineId?: string): UseRoutineEditorResult {
  const { getRoutineById, createRoutine, updateRoutine, deleteRoutine } = useRoutinesStore();
  const {
    draft,
    hasUnsavedChanges,
    initNewDraft,
    initDraftFromRoutine,
    clearDraft,
    setName,
    removeExercise,
    setExerciseSetCount,
    moveExercise,
  } = useRoutineDraft();
  const { startWorkoutFromRoutine } = useAppStore();
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const initializedKeyRef = useRef<string | null>(null);

  const isEditMode = Boolean(routineId);
  const existingRoutine = routineId ? getRoutineById(routineId) : undefined;
  const notFound = isEditMode && !existingRoutine;

  useEffect(() => {
    const targetKey = routineId ?? 'new';
    if (initializedKeyRef.current === targetKey) {
      return;
    }
    if (routineId) {
      if (!existingRoutine) {
        return;
      }
      initDraftFromRoutine(existingRoutine);
      initializedKeyRef.current = targetKey;
      return;
    }
    initNewDraft();
    initializedKeyRef.current = targetKey;
  }, [existingRoutine, initDraftFromRoutine, initNewDraft, routineId]);

  useEffect(() => {
    return (): void => {
      clearDraft();
    };
  }, [clearDraft]);

  useEffect(() => {
    if (validationMessage !== null && validateRoutine(draft).length === 0) {
      setValidationMessage(null);
    }
  }, [draft, validationMessage]);

  const validateAndPersist = (): Routine | null => {
    const problems = validateRoutine(draft);
    if (problems.length > 0) {
      setValidationMessage(ROUTINE_PROBLEM_MESSAGE[problems[0]]);
      return null;
    }
    setValidationMessage(null);
    if (routineId) {
      return updateRoutine(routineId, draft);
    }
    return createRoutine(draft);
  };

  const handleSaveRoutine = (): void => {
    const savedRoutine = validateAndPersist();
    if (!savedRoutine) {
      return;
    }
    clearDraft();
    router.back();
  };

  const handleSaveAndStart = (): void => {
    const savedRoutine = validateAndPersist();
    if (!savedRoutine) {
      return;
    }
    clearDraft();
    const started = startWorkoutFromRoutine(savedRoutine);
    if (started) {
      router.replace('/workout');
      return;
    }
    router.back();
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

  const handleDeleteRoutine = (): void => {
    if (!routineId) {
      return;
    }
    confirmAction({
      title: 'Delete routine?',
      message: 'This routine will be deleted. Past workouts in history will not be affected.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDestructive: true,
      onConfirm: (): void => {
        deleteRoutine(routineId);
        clearDraft();
        router.back();
      },
    });
  };

  const handleBack = (): void => {
    if (!hasUnsavedChanges) {
      clearDraft();
      router.back();
      return;
    }
    confirmAction({
      title: 'Discard changes?',
      message: 'You have unsaved changes in this routine.',
      confirmText: 'Discard',
      cancelText: 'Keep editing',
      isDestructive: true,
      onConfirm: (): void => {
        clearDraft();
        router.back();
      },
    });
  };

  return {
    draft,
    isEditMode,
    notFound,
    validationMessage,
    handleChangeName: (name: string): void => {
      setValidationMessage(null);
      setName(name);
    },
    handleAddExercise: (): void => {
      setValidationMessage(null);
      router.push(`/pick-exercise?target=${PickExerciseTargets.ROUTINE}`);
    },
    handleSetCountChange: (routineExerciseId: string, setCount: number): void =>
      setExerciseSetCount(routineExerciseId, setCount),
    handleMoveUp: (routineExerciseId: string): void =>
      moveExercise(routineExerciseId, MoveDirections.UP),
    handleMoveDown: (routineExerciseId: string): void =>
      moveExercise(routineExerciseId, MoveDirections.DOWN),
    handleRemoveExercise: (routineExerciseId: string): void => removeExercise(routineExerciseId),
    handleSaveRoutine,
    handleSaveAndStart,
    handleDeleteRoutine,
    handleBack,
  };
}
