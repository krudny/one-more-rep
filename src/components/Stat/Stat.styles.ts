import { StyleSheet } from 'react-native';
import type { Colors } from '@/theme/theme.types';
import type { StatStyles } from './Stat.types';

const STAT_VALUE_FONT_SIZE = 22;
const STAT_LABEL_FONT_SIZE = 12;

export function createStatStyles(colors: Colors): StatStyles {
  return StyleSheet.create({
    stat: {
      alignItems: 'center',
      flex: 1,
    },
    value: {
      color: colors.TEXT,
      fontSize: STAT_VALUE_FONT_SIZE,
      fontWeight: '800',
      fontVariant: ['tabular-nums'],
    },
    label: {
      color: colors.MUTED,
      fontSize: STAT_LABEL_FONT_SIZE,
    },
  });
}
