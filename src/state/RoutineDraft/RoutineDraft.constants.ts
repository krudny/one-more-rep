import { DEFAULT_ROUTINE_NAME } from '@/lib/routine/routine.constants';
import type { RoutineDraft } from '@/lib/types';

export const EMPTY_ROUTINE_DRAFT: RoutineDraft = {
  name: DEFAULT_ROUTINE_NAME,
  exercises: [],
};
