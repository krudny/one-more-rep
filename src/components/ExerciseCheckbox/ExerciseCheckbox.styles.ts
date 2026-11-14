import { StyleSheet, type ViewStyle } from 'react-native';
import { SPACING } from '@/theme';
import { EXERCISE_CHECKBOX_OPACITY } from './ExerciseCheckbox.constants';
import type { ExerciseCheckboxStyles } from './ExerciseCheckbox.types';

export function createExerciseCheckboxStyles(): ExerciseCheckboxStyles {
  return StyleSheet.create({
    container: {
      paddingTop: SPACING.XXS,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}

export function getExerciseCheckboxOpacityStyle(pressed: boolean): ViewStyle {
  return {
    opacity: pressed ? EXERCISE_CHECKBOX_OPACITY.PRESSED : EXERCISE_CHECKBOX_OPACITY.ENABLED,
  };
}
