import { StyleSheet } from 'react-native';
import { RADIUS, SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { InstructionStepsStyles } from './InstructionSteps.types';

const BADGE_SIZE = 22;
const BADGE_FONT_SIZE = 12;
const STEP_LINE_HEIGHT = 21;

export function createInstructionStepsStyles(colors: Colors): InstructionStepsStyles {
  return StyleSheet.create({
    container: {
      gap: SPACING.SM,
    },
    stepRow: {
      flexDirection: 'row',
      gap: SPACING.MD,
      alignItems: 'flex-start',
    },
    badge: {
      width: BADGE_SIZE,
      height: BADGE_SIZE,
      borderRadius: RADIUS.PILL,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.PRIMARY,
    },
    badgeText: {
      color: colors.PRIMARY_TEXT,
      fontSize: BADGE_FONT_SIZE,
      fontWeight: '800',
    },
    stepText: {
      color: colors.TEXT,
      flex: 1,
      lineHeight: STEP_LINE_HEIGHT,
    },
  });
}
