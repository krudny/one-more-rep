import { useEffect, useState } from 'react';
import type { Routine } from '@/lib/types';
import { loadJson, saveJson } from '@/services/storage/storage';
import { StorageKeys } from '@/services/storage/storage.constants';
import type { PersistedRoutinesState } from './usePersistedRoutines.types';

export function usePersistedRoutines(): PersistedRoutinesState {
  const [ready, setReady] = useState(false);
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    (async (): Promise<void> => {
      const storedRoutines = await loadJson<Routine[]>(StorageKeys.ROUTINES);
      if (Array.isArray(storedRoutines)) {
        setRoutines(storedRoutines);
      }
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (ready) {
      saveJson(StorageKeys.ROUTINES, routines);
    }
  }, [ready, routines]);

  return { ready, routines, setRoutines };
}
