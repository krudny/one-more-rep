import type { TextStyle, ViewStyle } from 'react-native';
import type { CatalogActionIcon } from '@/components/ExerciseRow/ExerciseRow.types';
import type { Exercise } from '@/lib/types';

export type ExerciseCatalogProps = {
  onSelect: ((exercise: Exercise) => void) | null; // null: rows are not tappable
  actionIcon?: CatalogActionIcon;
};

export type ExerciseCatalogStyles = {
  root: ViewStyle;
  header: ViewStyle;
  searchBox: ViewStyle;
  searchInput: TextStyle;
  chips: ViewStyle;
  listContent: ViewStyle;
  footerSpinner: ViewStyle;
};
