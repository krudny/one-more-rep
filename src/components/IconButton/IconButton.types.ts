import type { StyleProp, ViewStyle } from 'react-native';
import type { IconName } from '@/components/Button/Button.types';

export type IconButtonProps = {
  icon: IconName;
  onPress: () => void;
  size?: number;
  color?: string;
  label: string;
  style?: StyleProp<ViewStyle>;
};
