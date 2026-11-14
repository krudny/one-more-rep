import { StyleSheet } from 'react-native';
import { SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { RoutineExerciseRowStyles } from './RoutineExerciseRow.types';

const NAME_FONT_SIZE = 17;
const META_FONT_SIZE = 13;

export function createRoutineExerciseRowStyles(colors: Colors): RoutineExerciseRowStyles {
  return StyleSheet.create({
    card: {
      gap: SPACING.MD,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: SPACING.SM,
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
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.MD,
    },
    stepperContainer: {
      alignItems: 'center',
    },
  });
}
