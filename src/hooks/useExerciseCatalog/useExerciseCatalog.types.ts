import type { Exercise } from '@/lib/types';
import type { ExerciseFilters } from '@/lib/exerciseData/exerciseData.types';
import type { FilterKeys } from './useExerciseCatalog.constants';

export type FilterKey = (typeof FilterKeys)[keyof typeof FilterKeys];

export type ActiveCatalogFilters = Omit<ExerciseFilters, 'search'>;

export type UseExerciseCatalogResult = {
  search: string;
  setSearch: (value: string) => void;
  filters: ActiveCatalogFilters;
  openFilter: FilterKey | null;
  options: Record<FilterKey, string[]>;
  items: Exercise[];
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  total: number;
  hasActiveFilters: boolean;
  toggleOpenFilter: (key: FilterKey) => void;
  toggleFilterValue: (key: FilterKey, value: string) => void;
  clearFilters: () => void;
  reloadExercises: () => void;
  loadMoreExercises: () => void;
};
