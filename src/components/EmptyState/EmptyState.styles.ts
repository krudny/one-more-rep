import { StyleSheet } from 'react-native';
import { SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { EmptyStateStyles } from './EmptyState.types';

const EMPTY_TITLE_FONT_SIZE = 18;

export function createEmptyStateStyles(colors: Colors): EmptyStateStyles {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING.XL,
      gap: SPACING.SM,
    },
    title: {
      color: colors.TEXT,
      fontSize: EMPTY_TITLE_FONT_SIZE,
      fontWeight: '700',
    },
    subtitle: {
      color: colors.MUTED,
      textAlign: 'center',
    },
  });
}
