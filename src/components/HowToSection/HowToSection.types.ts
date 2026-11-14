import type { TextStyle, ViewStyle } from 'react-native';

export type HowToSectionProps = {
  exerciseId: string;
};

export type HowToSectionStyles = {
  container: ViewStyle;
  toggle: ViewStyle;
  toggleLabel: TextStyle;
  mutedText: TextStyle;
};
