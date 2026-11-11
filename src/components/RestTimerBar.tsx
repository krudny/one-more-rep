import { StyleSheet, Text, View } from 'react-native';
import { formatCountdown } from '@/lib/format';
import { useNow } from '@/lib/useNow';
import { useAppStore } from '@/state/AppStore';
import { useRestTimer } from '@/state/RestTimer';
import { radius, spacing, useColors } from '@/theme';
import { Button, Chip } from './ui';

const PRESETS = [60, 90, 120, 180];

/** Rest timer: countdown when running, quick-start presets when idle. */
export function RestTimerBar() {
  const c = useColors();
  const { profile } = useAppStore();
  const { endsAt, totalMs, start, adjust, stop } = useRestTimer();
  const now = useNow(200, endsAt != null);
  const remaining = endsAt != null ? endsAt - now : 0;
  const progress = endsAt != null ? Math.min(1, Math.max(0, remaining / totalMs)) : 0;

  if (endsAt == null) {
    return (
      <View style={[styles.wrap, { backgroundColor: c.card, borderColor: c.border }]}>
        <Text style={[styles.title, { color: c.muted }]}>Rest timer</Text>
        <View style={styles.presets}>
          {PRESETS.map((s) => (
            <Chip key={s} label={formatCountdown(s * 1000)} selected={s === profile.restSeconds} onPress={() => start(s)} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { backgroundColor: c.card, borderColor: c.primary }]}>
      <View style={[styles.track, { backgroundColor: c.chip }]}>
        <View style={[styles.fill, { backgroundColor: c.primary, width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.row}>
        <Button title="−15s" variant="secondary" onPress={() => adjust(-15)} style={styles.small} />
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={[styles.title, { color: c.muted }]}>Rest</Text>
          <Text style={[styles.time, { color: c.text }]}>{formatCountdown(remaining)}</Text>
        </View>
        <Button title="+15s" variant="secondary" onPress={() => adjust(15)} style={styles.small} />
      </View>
      <Button title="Skip rest" variant="ghost" onPress={stop} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.md, gap: spacing.sm },
  title: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  presets: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  time: { fontSize: 40, fontWeight: '800', fontVariant: ['tabular-nums'] },
  small: { minWidth: 72 },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6 },
});
