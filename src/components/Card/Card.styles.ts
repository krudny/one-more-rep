import { StyleSheet } from 'react-native';
import { RADIUS, SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { CardStyles } from './Card.types';

export function createCardStyles(colors: Colors): CardStyles {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.CARD,
      borderColor: colors.BORDER,
      borderRadius: RADIUS.LG,
      borderWidth: StyleSheet.hairlineWidth,
      padding: SPACING.LG,
    },
  });
}
