import type { ViewStyle } from 'react-native';

export type ExerciseCheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  label?: string;
};

export type ExerciseCheckboxStyles = {
  container: ViewStyle;
};
