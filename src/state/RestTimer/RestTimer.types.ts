import type { ReactNode } from 'react';

export type RestTimerProviderProps = {
  children: ReactNode;
};

export type RestTimer = {
  endsAt: number | null; // Timestamp when the rest ends, or null if idle
  totalMs: number;
  start: (seconds?: number) => void;
  adjust: (seconds: number) => void;
  stop: () => void;
};
