import { StyleSheet } from 'react-native';
import { RADIUS, SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import {
  BUTTON_FONT_SIZE,
  BUTTON_MIN_HEIGHT,
  BUTTON_OPACITY,
  ButtonVariants,
} from './Button.constants';
import type { ButtonColorTokens, ButtonStyles, ButtonVariant } from './Button.types';

export function getButtonColors(colors: Colors, variant: ButtonVariant): ButtonColorTokens {
  const backgroundMap: Record<ButtonVariant, string> = {
    [ButtonVariants.PRIMARY]: colors.PRIMARY,
    [ButtonVariants.SECONDARY]: colors.CHIP,
    [ButtonVariants.DANGER]: colors.DANGER,
    [ButtonVariants.GHOST]: colors.TRANSPARENT,
  };
  const foregroundMap: Record<ButtonVariant, string> = {
    [ButtonVariants.PRIMARY]: colors.PRIMARY_TEXT,
    [ButtonVariants.SECONDARY]: colors.TEXT,
    [ButtonVariants.DANGER]: colors.PRIMARY_TEXT,
    [ButtonVariants.GHOST]: colors.PRIMARY,
  };
  return {
    backgroundColor: backgroundMap[variant],
    foregroundColor: foregroundMap[variant],
  };
}

export function getButtonOpacity(disabled: boolean, pressed: boolean): number {
  if (disabled) {
    return BUTTON_OPACITY.DISABLED;
  }
  if (pressed) {
    return BUTTON_OPACITY.PRESSED;
  }
  return BUTTON_OPACITY.ENABLED;
}

export const buttonStyles: ButtonStyles = StyleSheet.create({
  button: {
    minHeight: BUTTON_MIN_HEIGHT,
    borderRadius: RADIUS.MD,
    paddingHorizontal: SPACING.LG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.SM,
  },
  buttonText: {
    fontSize: BUTTON_FONT_SIZE,
    fontWeight: '700',
  },
});
