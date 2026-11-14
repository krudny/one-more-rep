import { StyleSheet } from 'react-native';
import { type ViewStyle } from 'react-native';
import { RADIUS, SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import {
  STEPPER_BUTTON_FONT_SIZE,
  STEPPER_BUTTON_SIZE,
  STEPPER_INPUT_FONT_SIZE,
  STEPPER_INPUT_WIDTH,
  STEPPER_OPACITY,
} from './Stepper.constants';
import type { StepperStyles } from './Stepper.types';

const LABEL_FONT_SIZE = 12;

export function createStepperStyles(colors: Colors, large: boolean): StepperStyles {
  const buttonSize = large ? STEPPER_BUTTON_SIZE.LARGE : STEPPER_BUTTON_SIZE.REGULAR;
  const buttonFontSize = large ? STEPPER_BUTTON_FONT_SIZE.LARGE : STEPPER_BUTTON_FONT_SIZE.REGULAR;
  const inputFontSize = large ? STEPPER_INPUT_FONT_SIZE.LARGE : STEPPER_INPUT_FONT_SIZE.REGULAR;
  const inputWidth = large ? STEPPER_INPUT_WIDTH.LARGE : STEPPER_INPUT_WIDTH.REGULAR;

  return StyleSheet.create({
    wrap: {
      alignItems: 'center',
      gap: SPACING.XS,
    },
    label: {
      color: colors.MUTED,
      fontSize: LABEL_FONT_SIZE,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.SM,
    },
    button: {
      width: buttonSize,
      height: buttonSize,
      borderRadius: RADIUS.MD,
      alignItems: 'center',
      justifyContent: 'center',
    },
    decrementButton: {
      backgroundColor: colors.CHIP,
    },
    incrementButton: {
      backgroundColor: colors.PRIMARY,
    },
    buttonText: {
      fontSize: buttonFontSize,
      fontWeight: '700',
    },
    decrementText: {
      color: colors.TEXT,
    },
    incrementText: {
      color: colors.PRIMARY_TEXT,
    },
    input: {
      color: colors.TEXT,
      fontSize: inputFontSize,
      width: inputWidth,
      textAlign: 'center',
      fontWeight: '800',
      fontVariant: ['tabular-nums'],
      paddingVertical: 0,
    },
  });
}

export function getStepperButtonOpacityStyle(pressed: boolean): ViewStyle {
  return {
    opacity: pressed ? STEPPER_OPACITY.PRESSED : STEPPER_OPACITY.ENABLED,
  };
}
