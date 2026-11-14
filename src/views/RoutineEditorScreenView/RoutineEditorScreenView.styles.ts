import { StyleSheet } from 'react-native';
import { RADIUS, SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { RoutineEditorScreenViewStyles } from './RoutineEditorScreenView.types';

const LABEL_FONT_SIZE = 12;
const NAME_INPUT_FONT_SIZE = 20;
const ERROR_BORDER_WIDTH = 1;

export function createRoutineEditorScreenViewStyles(colors: Colors): RoutineEditorScreenViewStyles {
  return StyleSheet.create({
    keyboardContainer: {
      flex: 1,
    },
    container: {
      padding: SPACING.LG,
      gap: SPACING.LG,
      paddingBottom: SPACING.XXL,
    },
    nameCard: {
      gap: SPACING.XS,
    },
    fieldLabel: {
      color: colors.MUTED,
      fontSize: LABEL_FONT_SIZE,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    nameInput: {
      color: colors.TEXT,
      fontSize: NAME_INPUT_FONT_SIZE,
      fontWeight: '700',
      paddingVertical: SPACING.XS,
    },
    errorBox: {
      padding: SPACING.MD,
      borderRadius: RADIUS.MD,
      borderWidth: ERROR_BORDER_WIDTH,
      borderColor: colors.DANGER,
      backgroundColor: colors.CARD,
    },
    errorText: {
      color: colors.DANGER,
      fontWeight: '600',
    },
    bottomButtons: {
      gap: SPACING.SM,
    },
    headerLeftButton: {
      marginRight: SPACING.SM,
    },
  });
}
