import type { TextStyle, ViewStyle } from 'react-native';

export type StepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  decimals?: number;
  large?: boolean;
};

export type StepperStyles = {
  wrap: ViewStyle;
  label: TextStyle;
  row: ViewStyle;
  button: ViewStyle;
  decrementButton: ViewStyle;
  incrementButton: ViewStyle;
  buttonText: TextStyle;
  decrementText: TextStyle;
  incrementText: TextStyle;
  input: TextStyle;
};
