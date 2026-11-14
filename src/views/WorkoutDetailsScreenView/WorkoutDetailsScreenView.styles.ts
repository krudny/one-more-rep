import { StyleSheet } from 'react-native';
import { SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { WorkoutDetailsScreenViewStyles } from './WorkoutDetailsScreenView.types';

const TITLE_FONT_SIZE = 24;
const EXERCISE_NAME_FONT_SIZE = 17;
const META_FONT_SIZE = 12;
const SET_NUMBER_WIDTH = 56;

export function createWorkoutDetailsScreenViewStyles(
  colors: Colors,
): WorkoutDetailsScreenViewStyles {
  return StyleSheet.create({
    container: {
      padding: SPACING.LG,
      gap: SPACING.LG,
    },
    title: {
      color: colors.TEXT,
      fontSize: TITLE_FONT_SIZE,
      fontWeight: '800',
    },
    mutedText: {
      color: colors.MUTED,
    },
    statsCard: {
      gap: SPACING.LG,
    },
    statsRow: {
      flexDirection: 'row',
    },
    intensityNote: {
      color: colors.MUTED,
      fontSize: META_FONT_SIZE,
      textAlign: 'center',
    },
    exerciseCard: {
      gap: SPACING.SM,
    },
    exerciseName: {
      color: colors.TEXT,
      fontSize: EXERCISE_NAME_FONT_SIZE,
      fontWeight: '700',
    },
    setRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    setNumber: {
      color: colors.MUTED,
      width: SET_NUMBER_WIDTH,
    },
    setSummary: {
      color: colors.TEXT,
      flex: 1,
      fontVariant: ['tabular-nums'],
    },
    setSummarySkipped: {
      color: colors.MUTED,
    },
    skippedTag: {
      color: colors.MUTED,
      fontSize: META_FONT_SIZE,
    },
  });
}
