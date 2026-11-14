import { useCallback, useEffect, useRef, useState } from 'react';
import type { Exercise } from '@/lib/types';
import { getExercises, getFilterOptions } from '@/services/exerciseApi/exerciseApi';
import type { FilterOptions } from '@/services/exerciseApi/exerciseApi.types';
import { FilterKeys, SEARCH_DEBOUNCE_MS } from './useExerciseCatalog.constants';
import type {
  ActiveCatalogFilters,
  FilterKey,
  UseExerciseCatalogResult,
} from './useExerciseCatalog.types';

export function useExerciseCatalog(): UseExerciseCatalogResult {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<ActiveCatalogFilters>({});
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [options, setOptions] = useState<Record<FilterKey, string[]>>({
    [FilterKeys.BODY_PART]: [],
    [FilterKeys.MUSCLE]: [],
    [FilterKeys.EQUIPMENT]: [],
  });

  const [items, setItems] = useState<Exercise[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const requestIdRef = useRef(0);
  const optionsLoadedRef = useRef(false);

  useEffect(() => {
    const timeoutId = setTimeout((): void => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return (): void => clearTimeout(timeoutId);
  }, [search]);

  const loadPage = useCallback(
    async (reset: boolean): Promise<void> => {
      const currentRequestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);
      try {
        const offset = reset ? 0 : items.length;
        const page = await getExercises({ ...filters, search: debouncedSearch }, offset);
        if (currentRequestId !== requestIdRef.current) return;

        setItems((previousItems: Exercise[]) => {
          if (reset) return page.items;
          const seenIds = new Set(previousItems.map((exercise: Exercise) => exercise.id));
          return [
            ...previousItems,
            ...page.items.filter((exercise: Exercise) => !seenIds.has(exercise.id)),
          ];
        });
        setHasMore(page.hasMore);
        setTotal(page.total);

        if (!optionsLoadedRef.current) {
          optionsLoadedRef.current = true;
          getFilterOptions()
            .then((filterOptions: FilterOptions) =>
              setOptions({
                [FilterKeys.BODY_PART]: filterOptions.bodyParts,
                [FilterKeys.MUSCLE]: filterOptions.muscles,
                [FilterKeys.EQUIPMENT]: filterOptions.equipments,
              }),
            )
            .catch(() => {
              optionsLoadedRef.current = false;
            });
        }
      } catch (loadError: unknown) {
        if (currentRequestId !== requestIdRef.current) return;
        setError(loadError instanceof Error ? loadError.message : 'Could not load exercises');
        if (reset) setItems([]);
      } finally {
        if (currentRequestId === requestIdRef.current) setLoading(false);
      }
    },
    [filters, debouncedSearch, items.length],
  );

  useEffect(() => {
    loadPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, debouncedSearch]);

  const toggleOpenFilter = useCallback((key: FilterKey): void => {
    setOpenFilter((currentOpen: FilterKey | null) => (currentOpen === key ? null : key));
  }, []);

  const toggleFilterValue = useCallback((key: FilterKey, value: string): void => {
    setFilters((currentFilters: ActiveCatalogFilters) => ({
      ...currentFilters,
      [key]: currentFilters[key] === value ? undefined : value,
    }));
  }, []);

  const clearFilters = useCallback((): void => setFilters({}), []);
  const reloadExercises = useCallback((): void => {
    loadPage(true);
  }, [loadPage]);
  const loadMoreExercises = useCallback((): void => {
    if (!loading && hasMore && !error && items.length > 0) {
      loadPage(false);
    }
  }, [loading, hasMore, error, items.length, loadPage]);

  const hasActiveFilters = Boolean(filters.bodyPart || filters.muscle || filters.equipment);

  return {
    search,
    setSearch,
    filters,
    openFilter,
    options,
    items,
    hasMore,
    loading,
    error,
    total,
    hasActiveFilters,
    toggleOpenFilter,
    toggleFilterValue,
    clearFilters,
    reloadExercises,
    loadMoreExercises,
  };
}
