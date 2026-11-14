import { StyleSheet, type ViewStyle } from 'react-native';
import { RADIUS, SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import { PERCENT_SCALE } from './RestTimerBar.constants';
import type { RestTimerBarStyles } from './RestTimerBar.types';

const TITLE_FONT_SIZE = 12;
const TIME_FONT_SIZE = 40;
const SMALL_BUTTON_MIN_WIDTH = 72;
const TRACK_HEIGHT = 6;
const ACTIVE_BORDER_WIDTH = 1;

export function createRestTimerBarStyles(colors: Colors): RestTimerBarStyles {
  return StyleSheet.create({
    wrap: {
      backgroundColor: colors.CARD,
      borderColor: colors.BORDER,
      borderRadius: RADIUS.LG,
      borderWidth: ACTIVE_BORDER_WIDTH,
      padding: SPACING.MD,
      gap: SPACING.SM,
    },
    wrapActive: {
      borderColor: colors.PRIMARY,
    },
    title: {
      color: colors.MUTED,
      fontSize: TITLE_FONT_SIZE,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    presets: {
      flexDirection: 'row',
      gap: SPACING.SM,
      flexWrap: 'wrap',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.SM,
    },
    timerCenter: {
      alignItems: 'center',
      flex: 1,
    },
    time: {
      color: colors.TEXT,
      fontSize: TIME_FONT_SIZE,
      fontWeight: '800',
      fontVariant: ['tabular-nums'],
    },
    smallButton: {
      minWidth: SMALL_BUTTON_MIN_WIDTH,
    },
    track: {
      backgroundColor: colors.CHIP,
      height: TRACK_HEIGHT,
      borderRadius: RADIUS.PILL,
      overflow: 'hidden',
    },
    fill: {
      backgroundColor: colors.PRIMARY,
      height: TRACK_HEIGHT,
    },
  });
}

export function getProgressFillStyle(progress: number): ViewStyle {
  return {
    width: `${progress * PERCENT_SCALE}%`,
  };
}
