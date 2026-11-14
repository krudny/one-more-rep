import type { TextStyle, ViewStyle } from 'react-native';
import type { Workout } from '@/lib/types';

export type WorkoutRowProps = {
  workout: Workout;
};

export type WorkoutRowStyles = {
  row: ViewStyle;
  content: ViewStyle;
  title: TextStyle;
  meta: TextStyle;
};
