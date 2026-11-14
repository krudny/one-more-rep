import { StyleSheet } from 'react-native';
import { SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { HomeScreenViewStyles } from './HomeScreenView.types';

const HELLO_FONT_SIZE = 26;
const BIG_TIMER_FONT_SIZE = 44;
const LAST_TITLE_FONT_SIZE = 18;
const ACTIVE_CARD_BORDER_WIDTH = 1;

export function createHomeScreenViewStyles(colors: Colors): HomeScreenViewStyles {
  return StyleSheet.create({
    container: {
      padding: SPACING.LG,
      gap: SPACING.LG,
    },
    hello: {
      color: colors.TEXT,
      fontSize: HELLO_FONT_SIZE,
      fontWeight: '800',
    },
    activeCard: {
      gap: SPACING.MD,
      borderColor: colors.PRIMARY,
      borderWidth: ACTIVE_CARD_BORDER_WIDTH,
    },
    newCard: {
      gap: SPACING.MD,
    },
    lastCard: {
      gap: SPACING.SM,
    },
    bigTimer: {
      color: colors.TEXT,
      fontSize: BIG_TIMER_FONT_SIZE,
      fontWeight: '800',
      fontVariant: ['tabular-nums'],
    },
    mutedText: {
      color: colors.MUTED,
    },
    statsRow: {
      flexDirection: 'row',
    },
    lastTitle: {
      color: colors.TEXT,
      fontSize: LAST_TITLE_FONT_SIZE,
      fontWeight: '700',
    },
  });
}
