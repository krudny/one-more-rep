import { StyleSheet } from 'react-native';
import { SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { ExerciseDetailsScreenViewStyles } from './ExerciseDetailsScreenView.types';

const TITLE_FONT_SIZE = 24;
const TAG_LABEL_FONT_SIZE = 13;

export function createExerciseDetailsScreenViewStyles(
  colors: Colors,
): ExerciseDetailsScreenViewStyles {
  return StyleSheet.create({
    loadingSpinner: {
      marginTop: SPACING.XL,
    },
    container: {
      padding: SPACING.LG,
      gap: SPACING.LG,
      paddingBottom: SPACING.XXL,
    },
    title: {
      color: colors.TEXT,
      fontSize: TITLE_FONT_SIZE,
      fontWeight: '800',
    },
    detailsCard: {
      gap: SPACING.MD,
    },
    instructionsCard: {
      gap: SPACING.SM,
    },
    tagGroup: {
      gap: SPACING.XS,
    },
    tagLabel: {
      color: colors.MUTED,
      fontSize: TAG_LABEL_FONT_SIZE,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.SM,
    },
  });
}
