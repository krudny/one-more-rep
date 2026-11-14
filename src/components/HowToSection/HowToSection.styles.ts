import { StyleSheet } from 'react-native';
import { SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { HowToSectionStyles } from './HowToSection.types';

export function createHowToSectionStyles(colors: Colors): HowToSectionStyles {
  return StyleSheet.create({
    container: {
      gap: SPACING.MD,
    },
    toggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.SM,
    },
    toggleLabel: {
      color: colors.PRIMARY,
      fontWeight: '700',
      flex: 1,
    },
    mutedText: {
      color: colors.MUTED,
    },
  });
}
