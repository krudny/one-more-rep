import { StyleSheet } from 'react-native';
import { SPACING } from '@/theme';
import type { HistoryScreenViewStyles } from './HistoryScreenView.types';

export const historyScreenViewStyles: HistoryScreenViewStyles = StyleSheet.create({
  listContent: {
    padding: SPACING.LG,
    paddingBottom: SPACING.XXL,
    gap: SPACING.MD,
    flexGrow: 1,
  },
});
