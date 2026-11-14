import type { TextStyle, ViewStyle } from 'react-native';

export type InstructionStepsProps = {
  steps: string[];
};

export type InstructionStepsStyles = {
  container: ViewStyle;
  stepRow: ViewStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
  stepText: TextStyle;
};
