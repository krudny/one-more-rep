import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactElement } from 'react';
import { ActivityIndicator, Pressable, Text, type PressableStateCallbackType } from 'react-native';
import { useColors } from '@/theme';
import { BUTTON_ICON_SIZE, ButtonVariants } from './Button.constants';
import { buttonStyles, getButtonColors, getButtonOpacity } from './Button.styles';
import type { ButtonProps } from './Button.types';

export function Button({
  title,
  onPress,
  variant = ButtonVariants.PRIMARY,
  icon,
  disabled,
  loading,
  style,
}: ButtonProps): ReactElement {
  const colors = useColors();
  const { backgroundColor, foregroundColor } = getButtonColors(colors, variant);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={Boolean(disabled || loading)}
      style={({ pressed }: PressableStateCallbackType) => [
        buttonStyles.button,
        { backgroundColor, opacity: getButtonOpacity(Boolean(disabled), pressed) },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={foregroundColor} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={BUTTON_ICON_SIZE} color={foregroundColor} />}
          <Text style={[buttonStyles.buttonText, { color: foregroundColor }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}
