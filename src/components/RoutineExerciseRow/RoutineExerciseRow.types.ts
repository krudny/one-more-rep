import type { TextStyle, ViewStyle } from 'react-native';
import type { RoutineExercise } from '@/lib/types';

export type RoutineExerciseRowProps = {
  entry: RoutineExercise;
  isFirst: boolean;
  isLast: boolean;
  onSetCountChange: (setCount: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};

export type RoutineExerciseRowStyles = {
  card: ViewStyle;
  header: ViewStyle;
  titleLink: ViewStyle;
  name: TextStyle;
  meta: TextStyle;
  actions: ViewStyle;
  stepperContainer: ViewStyle;
};
