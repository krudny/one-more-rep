import { StyleSheet } from 'react-native';
import { RADIUS, SPACING } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { ChipStyles } from './Chip.types';

const CHIP_FONT_SIZE = 13;

export function createChipStyles(colors: Colors, selected: boolean): ChipStyles {
  return StyleSheet.create({
    chip: {
      paddingHorizontal: SPACING.MD,
      paddingVertical: SPACING.SM,
      borderRadius: RADIUS.PILL,
      backgroundColor: selected ? colors.PRIMARY : colors.CHIP,
    },
    label: {
      color: selected ? colors.PRIMARY_TEXT : colors.TEXT,
      fontSize: CHIP_FONT_SIZE,
      fontWeight: '600',
    },
  });
}
