import { StyleSheet } from 'react-native';
import { RADIUS, SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { ProfileScreenViewStyles } from './ProfileScreenView.types';

const INPUT_FONT_SIZE = 16;
const TOGGLE_FONT_SIZE = 16;

export function createProfileScreenViewStyles(colors: Colors): ProfileScreenViewStyles {
  return StyleSheet.create({
    container: {
      padding: SPACING.LG,
      gap: SPACING.LG,
      paddingBottom: SPACING.XXL,
    },
    card: {
      gap: SPACING.MD,
    },
    input: {
      color: colors.TEXT,
      borderColor: colors.BORDER,
      backgroundColor: colors.BACKGROUND,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: RADIUS.MD,
      padding: SPACING.MD,
      fontSize: INPUT_FONT_SIZE,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.SM,
    },
    mutedText: {
      color: colors.MUTED,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    toggleLabel: {
      color: colors.TEXT,
      fontSize: TOGGLE_FONT_SIZE,
      flex: 1,
    },
  });
}
