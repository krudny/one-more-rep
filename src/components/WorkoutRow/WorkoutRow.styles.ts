import { StyleSheet, type ViewStyle } from 'react-native';
import { RADIUS, SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import { WORKOUT_ROW_OPACITY } from './WorkoutRow.constants';
import type { WorkoutRowStyles } from './WorkoutRow.types';

const TITLE_FONT_SIZE = 16;
const META_FONT_SIZE = 13;

export function createWorkoutRowStyles(colors: Colors): WorkoutRowStyles {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.MD,
      padding: SPACING.LG,
      borderRadius: RADIUS.LG,
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: colors.CARD,
      borderColor: colors.BORDER,
    },
    content: {
      flex: 1,
      gap: SPACING.XXS,
    },
    title: {
      color: colors.TEXT,
      fontSize: TITLE_FONT_SIZE,
      fontWeight: '700',
    },
    meta: {
      color: colors.MUTED,
      fontSize: META_FONT_SIZE,
    },
  });
}

export function getWorkoutRowOpacityStyle(pressed: boolean): ViewStyle {
  return {
    opacity: pressed ? WORKOUT_ROW_OPACITY.PRESSED : WORKOUT_ROW_OPACITY.ENABLED,
  };
}
