import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, SectionTitle, Stat } from '@/components/ui';
import { formatDate, formatDuration } from '@/lib/format';
import { useNow } from '@/lib/useNow';
import { elapsedMs, workoutStats } from '@/lib/workout';
import { useAppStore } from '@/state/AppStore';
import { spacing, useColors } from '@/theme';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function HomeScreen() {
  const c = useColors();
  const { active, workouts, profile, startWorkout } = useAppStore();
  const now = useNow(1000, active != null);

  const weekAgo = Date.now() - WEEK_MS;
  const thisWeek = workouts.filter((w) => w.startedAt >= weekAgo);
  const weekCalories = thisWeek.reduce((sum, w) => sum + (w.calories ?? 0), 0);
  const weekTime = thisWeek.reduce((sum, w) => sum + (w.durationMs ?? 0), 0);
  const last = workouts[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.hello, { color: c.text }]}>
        {profile.name ? `Hey ${profile.name}!` : 'Ready for one more rep?'}
      </Text>

      {active ? (
        <Card style={{ gap: spacing.md, borderColor: c.primary, borderWidth: 1 }}>
          <SectionTitle>Workout in progress</SectionTitle>
          <Text style={[styles.big, { color: c.text }]}>{formatDuration(elapsedMs(active, now))}</Text>
          <Text style={{ color: c.muted }}>
            {active.name} · {active.exercises.length} exercises{active.resumedAt == null ? ' · paused' : ''}
          </Text>
          <Button title="Continue workout" icon="play" onPress={() => router.push('/workout')} />
        </Card>
      ) : (
        <Card style={{ gap: spacing.md }}>
          <SectionTitle>New workout</SectionTitle>
          <Text style={{ color: c.muted }}>Start the stopwatch, add exercises and count your reps.</Text>
          <Button
            title="Start workout"
            icon="flash"
            onPress={() => {
              startWorkout();
              router.push('/workout');
            }}
          />
        </Card>
      )}

      <Card>
        <SectionTitle>Last 7 days</SectionTitle>
        <View style={styles.stats}>
          <Stat label="Workouts" value={String(thisWeek.length)} />
          <Stat label="Time" value={formatDuration(weekTime)} />
          <Stat label="kcal" value={String(weekCalories)} />
        </View>
      </Card>

      {last && (
        <Card style={{ gap: spacing.sm }}>
          <SectionTitle>Last workout</SectionTitle>
          <Text style={[styles.lastTitle, { color: c.text }]}>{last.name}</Text>
          <Text style={{ color: c.muted }}>
            {formatDate(last.startedAt)} · {formatDuration(last.durationMs ?? 0)} · {workoutStats(last).sets} sets ·{' '}
            {last.calories ?? 0} kcal
          </Text>
          <Button title="View details" variant="secondary" onPress={() => router.push(`/history/${last.id}`)} />
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.lg },
  hello: { fontSize: 26, fontWeight: '800' },
  big: { fontSize: 44, fontWeight: '800', fontVariant: ['tabular-nums'] },
  stats: { flexDirection: 'row' },
  lastTitle: { fontSize: 18, fontWeight: '700' },
});
