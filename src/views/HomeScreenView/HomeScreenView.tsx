import type { ReactElement } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '@/components/Button/Button';
import { ButtonVariants } from '@/components/Button/Button.constants';
import { Card } from '@/components/Card/Card';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { RoutineCard } from '@/components/RoutineCard/RoutineCard';
import { SectionTitle } from '@/components/SectionTitle/SectionTitle';
import { Stat } from '@/components/Stat/Stat';
import { useHomeScreen } from '@/hooks/useHomeScreen/useHomeScreen';
import { formatDate, formatDuration } from '@/lib/format/format';
import type { Routine } from '@/lib/types';
import { getWorkoutStats } from '@/lib/workout/workout';
import { useColors } from '@/theme';
import { createHomeScreenViewStyles } from './HomeScreenView.styles';

export function HomeScreenView(): ReactElement {
  const colors = useColors();
  const styles = createHomeScreenViewStyles(colors);
  const {
    active,
    profileName,
    routines,
    weeklySummary,
    lastWorkout,
    elapsedMs,
    handleContinueWorkout,
    handleStartEmptyWorkout,
    handleStartRoutine,
    handleNewRoutine,
    handleEditRoutine,
    handleViewWorkoutDetails,
  } = useHomeScreen();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.hello}>
        {profileName ? `Hey ${profileName}!` : 'Ready for one more rep?'}
      </Text>

      {active && (
        <Card style={styles.activeCard}>
          <SectionTitle>Workout in progress</SectionTitle>
          <Text style={styles.bigTimer}>{formatDuration(elapsedMs)}</Text>
          <Text style={styles.mutedText}>
            {active.name} · {active.exercises.length} exercises
            {active.resumedAt === null ? ' · paused' : ''}
          </Text>
          <Button title="Continue" icon="play" onPress={handleContinueWorkout} />
        </Card>
      )}

      <Button title="Start empty workout" icon="flash" onPress={handleStartEmptyWorkout} />

      <View style={styles.routinesSection}>
        <View style={styles.routinesHeader}>
          <SectionTitle>My routines</SectionTitle>
          <Button
            title="New routine"
            icon="add"
            variant={ButtonVariants.SECONDARY}
            onPress={handleNewRoutine}
          />
        </View>

        {routines.length === 0 ? (
          <EmptyState
            icon="list-outline"
            title="No routines yet"
            subtitle='Tap "New routine" above to create a reusable workout plan.'
          />
        ) : (
          <View style={styles.routinesList}>
            {routines.map((routine: Routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onStart={handleStartRoutine}
                onEdit={handleEditRoutine}
              />
            ))}
          </View>
        )}
      </View>

      <Card style={styles.statsCard}>
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
            onPress={(): void => handleViewWorkoutDetails(lastWorkout.id)}
          />
        </Card>
      )}
    </ScrollView>
  );
}
