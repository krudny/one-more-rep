import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Vibration } from 'react-native';
import { useAppStore } from './AppStore';

type RestTimer = {
  /** Timestamp when the rest ends, or null if no rest is running. */
  endsAt: number | null;
  totalMs: number;
  start: (seconds?: number) => void;
  adjust: (seconds: number) => void;
  stop: () => void;
};

const RestTimerContext = createContext<RestTimer | null>(null);

const restDoneSound = require('../../assets/sounds/rest-done.wav');

export function RestTimerProvider({ children }: { children: ReactNode }) {
  const { profile } = useAppStore();
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [totalMs, setTotalMs] = useState(profile.restSeconds * 1000);
  const player = useAudioPlayer(restDoneSound);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const notify = useRef<() => void>(() => {});
  notify.current = () => {
    if (profile.restSound) {
      try {
        player.seekTo(0);
        player.play();
      } catch {}
    }
    if (profile.restVibration) {
      Vibration.vibrate([0, 400, 200, 400]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  };

  // Fire once when the countdown reaches zero.
  useEffect(() => {
    if (endsAt == null) return;
    const remaining = endsAt - Date.now();
    const id = setTimeout(() => {
      notify.current();
      setEndsAt(null);
    }, Math.max(0, remaining));
    return () => clearTimeout(id);
  }, [endsAt]);

  const start = useCallback(
    (seconds?: number) => {
      const ms = (seconds ?? profile.restSeconds) * 1000;
      setTotalMs(ms);
      setEndsAt(Date.now() + ms);
    },
    [profile.restSeconds],
  );

  const adjust = useCallback((seconds: number) => {
    setEndsAt((cur) => {
      if (cur == null) return cur;
      const next = cur + seconds * 1000;
      return next <= Date.now() ? null : next;
    });
    setTotalMs((t) => Math.max(1000, t + seconds * 1000));
  }, []);

  const stop = useCallback(() => setEndsAt(null), []);

  const value = useMemo(() => ({ endsAt, totalMs, start, adjust, stop }), [endsAt, totalMs, start, adjust, stop]);
  return <RestTimerContext.Provider value={value}>{children}</RestTimerContext.Provider>;
}

export function useRestTimer(): RestTimer {
  const ctx = useContext(RestTimerContext);
  if (!ctx) throw new Error('useRestTimer must be used inside RestTimerProvider');
  return ctx;
}
