import { useEffect, useState } from 'react';
import { DEFAULT_NOW_INTERVAL_MS } from './useNow.constants';

export function useNow(intervalMs = DEFAULT_NOW_INTERVAL_MS, enabled = true): number {
  const [nowTimestamp, setNowTimestamp] = useState(() => Date.now());
  useEffect(() => {
    if (!enabled) {
      return;
    }
    setNowTimestamp(Date.now());
    const intervalId = setInterval(() => setNowTimestamp(Date.now()), intervalMs);
    return (): void => clearInterval(intervalId);
  }, [intervalMs, enabled]);
  return nowTimestamp;
}
