import { StyleSheet } from 'react-native';
import { SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { RoutineCardStyles } from './RoutineCard.types';

const TITLE_FONT_SIZE = 18;

export function createRoutineCardStyles(colors: Colors): RoutineCardStyles {
  return StyleSheet.create({
    card: {
      gap: SPACING.SM,
    },
    title: {
      color: colors.TEXT,
      fontSize: TITLE_FONT_SIZE,
      fontWeight: '700',
    },
    meta: {
      color: colors.MUTED,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: SPACING.SM,
      marginTop: SPACING.XS,
    },
    actionButton: {
      flex: 1,
    },
  });
}
