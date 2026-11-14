import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactElement } from 'react';
import { Pressable, type PressableStateCallbackType } from 'react-native';
import { useColors } from '@/theme';
import { DEFAULT_ICON_SIZE, ICON_BUTTON_HIT_SLOP } from './IconButton.constants';
import { getIconButtonStyle } from './IconButton.styles';
import type { IconButtonProps } from './IconButton.types';

export function IconButton({
  icon,
  onPress,
  size = DEFAULT_ICON_SIZE,
  color,
  label,
  style,
}: IconButtonProps): ReactElement {
  const colors = useColors();

  return (
    <Pressable
      accessibilityLabel={label}
      hitSlop={ICON_BUTTON_HIT_SLOP}
      onPress={onPress}
      style={({ pressed }: PressableStateCallbackType) => [getIconButtonStyle(pressed), style]}
    >
      <Ionicons name={icon} size={size} color={color ?? colors.MUTED} />
    </Pressable>
  );
}
