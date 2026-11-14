import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { ButtonVariants } from './Button.constants';

export type ButtonVariant = (typeof ButtonVariants)[keyof typeof ButtonVariants];

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type ButtonColorTokens = {
  backgroundColor: string;
  foregroundColor: string;
};

export type ButtonStyles = {
  button: ViewStyle;
  buttonText: TextStyle;
};

export type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};
