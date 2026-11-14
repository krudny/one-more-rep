import { useState } from 'react';
import { showAlert } from '@/services/dialogs/dialogs';
import { refreshExercises } from '@/services/exerciseApi/exerciseApi';
import type { UseProfileCatalogRefreshResult } from './useProfileCatalogRefresh.types';

export function useProfileCatalogRefresh(): UseProfileCatalogRefreshResult {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshCatalog = async (): Promise<void> => {
    setRefreshing(true);
    try {
      const exerciseCount = await refreshExercises();
      showAlert('Catalog updated', `${exerciseCount} exercises available.`);
    } catch (refreshError: unknown) {
      const errorMessage =
        refreshError instanceof Error
          ? refreshError.message
          : 'Check your connection and try again.';
      showAlert('Update failed', errorMessage);
    } finally {
      setRefreshing(false);
    }
  };

  return { refreshing, handleRefreshCatalog };
}
