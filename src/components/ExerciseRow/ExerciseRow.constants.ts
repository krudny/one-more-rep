import type { CatalogActionIcon } from './ExerciseRow.types';

export const CatalogActionIcons = {
  ADD_CIRCLE: 'add-circle',
  CHEVRON_FORWARD: 'chevron-forward',
} as const;

export const ACTION_ICON_SIZE: Record<CatalogActionIcon, number> = {
  [CatalogActionIcons.ADD_CIRCLE]: 28,
  [CatalogActionIcons.CHEVRON_FORWARD]: 20,
};

export const EXERCISE_ROW_OPACITY = {
  ENABLED: 1,
  PRESSED: 0.8,
} as const;
