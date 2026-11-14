import type { TextStyle, ViewStyle } from 'react-native';
import type { WorkoutExercise } from '@/lib/types';

export type ExerciseLogCardProps = {
  entry: WorkoutExercise;
};

export type ExerciseLogCardStyles = {
  card: ViewStyle;
  header: ViewStyle;
  titleLink: ViewStyle;
  name: TextStyle;
  meta: TextStyle;
  setsList: ViewStyle;
  setRow: ViewStyle;
  setRowSelected: ViewStyle;
  setNo: TextStyle;
  setValue: TextStyle;
  editor: ViewStyle;
  editorTitle: TextStyle;
  completeButton: ViewStyle;
};
