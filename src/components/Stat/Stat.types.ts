import type { TextStyle, ViewStyle } from 'react-native';

export type StatProps = {
  label: string;
  value: string;
};

export type StatStyles = {
  stat: ViewStyle;
  value: TextStyle;
  label: TextStyle;
};
