import { StyleSheet, type ViewStyle } from 'react-native';
import { RADIUS, SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import { EXERCISE_ROW_OPACITY } from './ExerciseRow.constants';
import type { ExerciseRowStyles } from './ExerciseRow.types';

const THUMB_SIZE = 56;
const NAME_FONT_SIZE = 16;
const META_FONT_SIZE = 13;

export function createExerciseRowStyles(colors: Colors): ExerciseRowStyles {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.MD,
      padding: SPACING.SM,
      paddingRight: SPACING.MD,
      borderRadius: RADIUS.MD,
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: colors.CARD,
      borderColor: colors.BORDER,
    },
    thumb: {
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: RADIUS.SM,
      backgroundColor: colors.CHIP,
    },
    content: {
      flex: 1,
      gap: SPACING.XXS,
    },
    name: {
      color: colors.TEXT,
      fontSize: NAME_FONT_SIZE,
      fontWeight: '600',
    },
    meta: {
      color: colors.MUTED,
      fontSize: META_FONT_SIZE,
    },
  });
}

export function getExerciseRowOpacityStyle(pressed: boolean): ViewStyle {
  return {
    opacity: pressed ? EXERCISE_ROW_OPACITY.PRESSED : EXERCISE_ROW_OPACITY.ENABLED,
  };
}
