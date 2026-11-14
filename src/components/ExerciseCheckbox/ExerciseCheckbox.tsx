import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactElement } from 'react';
import { Pressable, type PressableStateCallbackType } from 'react-native';
import { useColors } from '@/theme';
import {
  EXERCISE_CHECKBOX_HIT_SLOP,
  EXERCISE_CHECKBOX_ICON_SIZE,
} from './ExerciseCheckbox.constants';
import {
  createExerciseCheckboxStyles,
  getExerciseCheckboxOpacityStyle,
} from './ExerciseCheckbox.styles';
import type { ExerciseCheckboxProps } from './ExerciseCheckbox.types';

export function ExerciseCheckbox({
  checked,
  onToggle,
  label,
}: ExerciseCheckboxProps): ReactElement {
  const colors = useColors();
  const styles = createExerciseCheckboxStyles();
  const accessibilityLabel =
    label ?? (checked ? 'Mark exercise as not done' : 'Mark exercise as done');

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={EXERCISE_CHECKBOX_HIT_SLOP}
      onPress={onToggle}
      style={({ pressed }: PressableStateCallbackType) => [
        styles.container,
        getExerciseCheckboxOpacityStyle(pressed),
      ]}
    >
      <Ionicons
        name={checked ? 'checkbox' : 'square-outline'}
        size={EXERCISE_CHECKBOX_ICON_SIZE}
        color={checked ? colors.SUCCESS : colors.MUTED}
      />
    </Pressable>
  );
}
