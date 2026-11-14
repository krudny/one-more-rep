import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { Exercise } from '@/lib/types';
import type { CatalogActionIcons } from './ExerciseRow.constants';

export type CatalogActionIcon = (typeof CatalogActionIcons)[keyof typeof CatalogActionIcons];

export type ExerciseRowProps = {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
  actionIcon: CatalogActionIcon;
};

export type ExerciseRowStyles = {
  row: ViewStyle;
  thumb: ImageStyle;
  content: ViewStyle;
  name: TextStyle;
  meta: TextStyle;
};
