import { StyleSheet } from 'react-native';
import type { Colors } from '@/theme/theme.types';
import type { SectionTitleStyles } from './SectionTitle.types';

const SECTION_TITLE_FONT_SIZE = 15;
const SECTION_TITLE_LETTER_SPACING = 0.6;

export function createSectionTitleStyles(colors: Colors): SectionTitleStyles {
  return StyleSheet.create({
    title: {
      color: colors.MUTED,
      fontSize: SECTION_TITLE_FONT_SIZE,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: SECTION_TITLE_LETTER_SPACING,
    },
  });
}
