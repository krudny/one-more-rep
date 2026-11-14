import { StyleSheet } from 'react-native';
import { RADIUS, SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { ExerciseCatalogStyles } from './ExerciseCatalog.types';

const SEARCH_INPUT_FONT_SIZE = 16;

export function createExerciseCatalogStyles(colors: Colors): ExerciseCatalogStyles {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    header: {
      padding: SPACING.LG,
      gap: SPACING.LG,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.SM,
      borderRadius: RADIUS.MD,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: SPACING.MD,
      backgroundColor: colors.CARD,
      borderColor: colors.BORDER,
    },
    searchInput: {
      flex: 1,
      color: colors.TEXT,
      fontSize: SEARCH_INPUT_FONT_SIZE,
      paddingVertical: SPACING.SM,
    },
    chips: {
      gap: SPACING.SM,
    },
    listContent: {
      padding: SPACING.LG,
      paddingTop: 0,
      paddingBottom: SPACING.XXL,
      gap: SPACING.MD,
      flexGrow: 1,
    },
    footerSpinner: {
      margin: SPACING.LG,
    },
  });
}
