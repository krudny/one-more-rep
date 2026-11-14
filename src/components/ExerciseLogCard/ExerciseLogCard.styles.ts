import { StyleSheet } from 'react-native';
import { RADIUS, SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { ExerciseLogCardStyles } from './ExerciseLogCard.types';

const NAME_FONT_SIZE = 17;
const META_FONT_SIZE = 13;
const SET_NUMBER_WIDTH = 48;
const SET_VALUE_FONT_SIZE = 16;

export function createExerciseLogCardStyles(colors: Colors): ExerciseLogCardStyles {
  return StyleSheet.create({
    card: {
      gap: SPACING.MD,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: SPACING.MD,
    },
    titleLink: {
      flex: 1,
    },
    name: {
      color: colors.TEXT,
      fontSize: NAME_FONT_SIZE,
      fontWeight: '700',
    },
    meta: {
      color: colors.MUTED,
      fontSize: META_FONT_SIZE,
    },
    setsList: {
      gap: SPACING.XS,
    },
    setRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.MD,
      paddingHorizontal: SPACING.MD,
      paddingVertical: SPACING.SM,
      borderRadius: RADIUS.MD,
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: colors.TRANSPARENT,
      borderColor: colors.BORDER,
    },
    setRowSelected: {
      backgroundColor: colors.CHIP,
      borderColor: colors.PRIMARY,
    },
    setNo: {
      color: colors.MUTED,
      width: SET_NUMBER_WIDTH,
      fontWeight: '600',
    },
    setValue: {
      color: colors.TEXT,
      flex: 1,
      fontSize: SET_VALUE_FONT_SIZE,
      fontWeight: '600',
      fontVariant: ['tabular-nums'],
    },
    editor: {
      alignItems: 'center',
      gap: SPACING.MD,
      paddingVertical: SPACING.MD,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.BORDER,
    },
    editorTitle: {
      color: colors.MUTED,
      fontWeight: '700',
    },
    completeButton: {
      alignSelf: 'stretch',
    },
  });
}
