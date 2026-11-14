import type { ReactElement } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/Button/Button';
import { ButtonVariants } from '@/components/Button/Button.constants';
import { Chip } from '@/components/Chip/Chip';
import { useNow } from '@/hooks/useNow/useNow';
import { formatCountdown } from '@/lib/format/format';
import { useAppStore } from '@/state/AppStore/AppStore';
import { useRestTimer } from '@/state/RestTimer/RestTimer';
import { useColors } from '@/theme';
import {
  MILLISECONDS_PER_SECOND,
  REST_ADJUST_SECONDS,
  REST_POLL_INTERVAL_MS,
  REST_PRESET_SECONDS,
} from './RestTimerBar.constants';
import { createRestTimerBarStyles, getProgressFillStyle } from './RestTimerBar.styles';

export function RestTimerBar(): ReactElement {
  const colors = useColors();
  const styles = createRestTimerBarStyles(colors);
  const { profile } = useAppStore();
  const { endsAt, totalMs, start, adjust, stop } = useRestTimer();
  const nowTimestamp = useNow(REST_POLL_INTERVAL_MS, endsAt !== null);
  const remainingMs = endsAt !== null ? endsAt - nowTimestamp : 0;
  const progress = endsAt !== null ? Math.min(1, Math.max(0, remainingMs / totalMs)) : 0;

  if (endsAt === null) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.title}>Rest timer</Text>
        <View style={styles.presets}>
          {REST_PRESET_SECONDS.map((presetSeconds: number) => (
            <Chip
              key={presetSeconds}
              label={formatCountdown(presetSeconds * MILLISECONDS_PER_SECOND)}
              selected={presetSeconds === profile.restSeconds}
              onPress={(): void => start(presetSeconds)}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, styles.wrapActive]}>
      <View style={styles.track}>
        <View style={[styles.fill, getProgressFillStyle(progress)]} />
      </View>
      <View style={styles.row}>
        <Button
          title={`−${REST_ADJUST_SECONDS}s`}
          variant={ButtonVariants.SECONDARY}
          onPress={(): void => adjust(-REST_ADJUST_SECONDS)}
          style={styles.smallButton}
        />
        <View style={styles.timerCenter}>
          <Text style={styles.title}>Rest</Text>
          <Text style={styles.time}>{formatCountdown(remainingMs)}</Text>
        </View>
        <Button
          title={`+${REST_ADJUST_SECONDS}s`}
          variant={ButtonVariants.SECONDARY}
          onPress={(): void => adjust(REST_ADJUST_SECONDS)}
          style={styles.smallButton}
        />
      </View>
      <Button title="Skip rest" variant={ButtonVariants.GHOST} onPress={stop} />
    </View>
  );
}
