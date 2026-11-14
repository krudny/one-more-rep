import type { ReactNode } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import type { IconName } from '@/components/Button/Button.types';

export type EmptyStateProps = {
  icon: IconName;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export type EmptyStateStyles = {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
};
