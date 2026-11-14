import type { Dispatch, SetStateAction } from 'react';
import type { Routine } from '@/lib/types';

export type PersistedRoutinesState = {
  ready: boolean;
  routines: Routine[];
  setRoutines: Dispatch<SetStateAction<Routine[]>>;
};
