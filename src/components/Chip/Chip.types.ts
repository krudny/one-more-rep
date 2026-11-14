import type { TextStyle, ViewStyle } from 'react-native';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export type ChipStyles = {
  chip: ViewStyle;
  label: TextStyle;
};
