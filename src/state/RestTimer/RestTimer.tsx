import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import { Vibration } from 'react-native';
import { useAppStore } from '@/state/AppStore/AppStore';
import {
  MILLISECONDS_PER_SECOND,
  MIN_TOTAL_MS,
  REST_DONE_SOUND,
  VIBRATION_PATTERN,
} from './RestTimer.constants';
import type { RestTimer, RestTimerProviderProps } from './RestTimer.types';

const RestTimerContext = createContext<RestTimer | null>(null);

export function RestTimerProvider({ children }: RestTimerProviderProps): ReactElement {
  const { profile } = useAppStore();
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [totalMs, setTotalMs] = useState(profile.restSeconds * MILLISECONDS_PER_SECOND);
  const player = useAudioPlayer(REST_DONE_SOUND);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const notifyRef = useRef<() => void>(() => {});
  notifyRef.current = (): void => {
    if (profile.restSound) {
      try {
        player.seekTo(0);
        player.play();
      } catch {}
    }
    if (profile.restVibration) {
      Vibration.vibrate(VIBRATION_PATTERN);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  };

  useEffect(() => {
    if (endsAt === null) {
      return;
    }
    const remainingMs = endsAt - Date.now();
    const timeoutId = setTimeout(
      () => {
        notifyRef.current();
        setEndsAt(null);
      },
      Math.max(0, remainingMs),
    );
    return (): void => clearTimeout(timeoutId);
  }, [endsAt]);

  const start = useCallback(
    (seconds?: number): void => {
      const durationMs = (seconds ?? profile.restSeconds) * MILLISECONDS_PER_SECOND;
      setTotalMs(durationMs);
      setEndsAt(Date.now() + durationMs);
    },
    [profile.restSeconds],
  );

  const adjust = useCallback((seconds: number): void => {
    const deltaMs = seconds * MILLISECONDS_PER_SECOND;
    setEndsAt((currentEndsAt: number | null) => {
      if (currentEndsAt === null) {
        return currentEndsAt;
      }
      const nextEndsAt = currentEndsAt + deltaMs;
      return nextEndsAt <= Date.now() ? null : nextEndsAt;
    });
    setTotalMs((currentTotalMs: number) => Math.max(MIN_TOTAL_MS, currentTotalMs + deltaMs));
  }, []);

  const stop = useCallback((): void => setEndsAt(null), []);

  const value = useMemo<RestTimer>(
    () => ({ endsAt, totalMs, start, adjust, stop }),
    [endsAt, totalMs, start, adjust, stop],
  );
  return <RestTimerContext.Provider value={value}>{children}</RestTimerContext.Provider>;
}

export function useRestTimer(): RestTimer {
  const context = useContext(RestTimerContext);
  if (!context) {
    throw new Error('useRestTimer must be used inside RestTimerProvider');
  }
  return context;
}
