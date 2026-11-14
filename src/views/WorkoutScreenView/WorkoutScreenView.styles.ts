import { StyleSheet } from 'react-native';
import { SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { WorkoutScreenViewStyles } from './WorkoutScreenView.types';

const WORKOUT_NAME_FONT_SIZE = 20;
const CLOCK_FONT_SIZE = 44;

export function createWorkoutScreenViewStyles(colors: Colors): WorkoutScreenViewStyles {
  return StyleSheet.create({
    keyboardContainer: {
      flex: 1,
    },
    container: {
      padding: SPACING.LG,
      gap: SPACING.LG,
      paddingBottom: SPACING.XXL,
    },
    headerCard: {
      gap: SPACING.MD,
    },
    nameInput: {
      color: colors.TEXT,
      fontSize: WORKOUT_NAME_FONT_SIZE,
      fontWeight: '700',
      padding: 0,
    },
    clockRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.MD,
    },
    clockMetaColumn: {
      flex: 1,
    },
    clock: {
      color: colors.TEXT,
      fontSize: CLOCK_FONT_SIZE,
      fontWeight: '800',
      fontVariant: ['tabular-nums'],
    },
    clockPaused: {
      color: colors.MUTED,
    },
    mutedText: {
      color: colors.MUTED,
    },
    chips: {
      flexDirection: 'row',
      gap: SPACING.SM,
    },
    headerRightButton: {
      marginRight: SPACING.LG,
    },
  });
}
