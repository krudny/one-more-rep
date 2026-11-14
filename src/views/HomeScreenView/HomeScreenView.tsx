import { router } from 'expo-router';
import type { ReactElement } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '@/components/Button/Button';
import { ButtonVariants } from '@/components/Button/Button.constants';
import { Card } from '@/components/Card/Card';
import { SectionTitle } from '@/components/SectionTitle/SectionTitle';
import { Stat } from '@/components/Stat/Stat';
import { useNow } from '@/hooks/useNow/useNow';
import { formatDate, formatDuration } from '@/lib/format/format';
import { getElapsedMs, getWeeklyWorkoutSummary, getWorkoutStats } from '@/lib/workout/workout';
import { useAppStore } from '@/state/AppStore/AppStore';
import { useColors } from '@/theme';
import { HOME_CLOCK_INTERVAL_MS } from './HomeScreenView.constants';
import { createHomeScreenViewStyles } from './HomeScreenView.styles';

export function HomeScreenView(): ReactElement {
  const colors = useColors();
  const styles = createHomeScreenViewStyles(colors);
  const { active, workouts, profile, startEmptyWorkout } = useAppStore();
  const nowTimestamp = useNow(HOME_CLOCK_INTERVAL_MS, active !== null);

  const weeklySummary = getWeeklyWorkoutSummary(workouts);
  const lastWorkout = workouts[0];

  const handleStartWorkout = (): void => {
    if (startEmptyWorkout()) {
      router.push('/workout');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.hello}>
        {profile.name ? `Hey ${profile.name}!` : 'Ready for one more rep?'}
      </Text>

      {active ? (
        <Card style={styles.activeCard}>
          <SectionTitle>Workout in progress</SectionTitle>
          <Text style={styles.bigTimer}>{formatDuration(getElapsedMs(active, nowTimestamp))}</Text>
          <Text style={styles.mutedText}>
            {active.name} · {active.exercises.length} exercises
            {active.resumedAt === null ? ' · paused' : ''}
          </Text>
          <Button
            title="Continue workout"
            icon="play"
            onPress={(): void => router.push('/workout')}
          />
        </Card>
      ) : (
        <Card style={styles.newCard}>
          <SectionTitle>New workout</SectionTitle>
          <Text style={styles.mutedText}>
            Start the stopwatch, add exercises and count your reps.
          </Text>
          <Button title="Start workout" icon="flash" onPress={handleStartWorkout} />
        </Card>
      )}

      <Card>
        <SectionTitle>Last 7 days</SectionTitle>
        <View style={styles.statsRow}>
          <Stat label="Workouts" value={String(weeklySummary.count)} />
          <Stat label="Time" value={formatDuration(weeklySummary.durationMs)} />
          <Stat label="kcal" value={String(weeklySummary.calories)} />
        </View>
      </Card>

      {lastWorkout && (
        <Card style={styles.lastCard}>
          <SectionTitle>Last workout</SectionTitle>
          <Text style={styles.lastTitle}>{lastWorkout.name}</Text>
          <Text style={styles.mutedText}>
            {formatDate(lastWorkout.startedAt)} · {formatDuration(lastWorkout.durationMs)} ·{' '}
            {getWorkoutStats(lastWorkout).sets} sets · {lastWorkout.calories} kcal
          </Text>
          <Button
            title="View details"
            variant={ButtonVariants.SECONDARY}
            onPress={(): void => router.push(`/history/${lastWorkout.id}`)}
          />
        </Card>
      )}
    </ScrollView>
  );
}
