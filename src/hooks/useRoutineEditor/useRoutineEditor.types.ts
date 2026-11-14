import type { RoutineDraft } from '@/lib/types';

export type UseRoutineEditorResult = {
  draft: RoutineDraft;
  isEditMode: boolean;
  notFound: boolean;
  validationMessage: string | null;
  handleChangeName: (name: string) => void;
  handleAddExercise: () => void;
  handleSetCountChange: (routineExerciseId: string, setCount: number) => void;
  handleMoveUp: (routineExerciseId: string) => void;
  handleMoveDown: (routineExerciseId: string) => void;
  handleRemoveExercise: (routineExerciseId: string) => void;
  handleSaveRoutine: () => void;
  handleSaveAndStart: () => void;
  handleDeleteRoutine: () => void;
  handleBack: () => void;
};
