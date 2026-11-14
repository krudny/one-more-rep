import { Stack } from 'expo-router';
import type { ReactElement } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '@/components/Button/Button';
import { ButtonVariants } from '@/components/Button/Button.constants';
import { Card } from '@/components/Card/Card';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { SectionTitle } from '@/components/SectionTitle/SectionTitle';
import { Stat } from '@/components/Stat/Stat';
import { useWorkoutDetailsScreen } from '@/hooks/useWorkoutDetailsScreen/useWorkoutDetailsScreen';
import { INTENSITY_LABEL, INTENSITY_MET } from '@/lib/calories/calories.constants';
import { capitalize, formatDate, formatDuration, formatTime } from '@/lib/format/format';
import type { WorkoutExercise, WorkoutSet } from '@/lib/types';
import { useColors } from '@/theme';
import { createWorkoutDetailsScreenViewStyles } from './WorkoutDetailsScreenView.styles';
import type { WorkoutDetailsScreenViewProps } from './WorkoutDetailsScreenView.types';

export function WorkoutDetailsScreenView({
  workoutId,
}: WorkoutDetailsScreenViewProps): ReactElement {
  const colors = useColors();
  const styles = createWorkoutDetailsScreenViewStyles(colors);
  const { workout, stats, canSaveAsRoutine, handleSaveAsRoutine, handleDelete } =
    useWorkoutDetailsScreen(workoutId);

  if (!workout || !stats) {
    return <EmptyState icon="alert-circle-outline" title="Workout not found" />;
  }

  return (
    <>
      <Stack.Screen options={{ title: workout.name }} />
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text style={styles.title}>{workout.name}</Text>
          <Text style={styles.mutedText}>
            {formatDate(workout.startedAt)}, {formatTime(workout.startedAt)}
            {workout.endedAt !== null ? ` – ${formatTime(workout.endedAt)}` : ''}
          </Text>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <Stat label="Duration" value={formatDuration(workout.durationMs)} />
            <Stat label="kcal" value={String(workout.calories)} />
            <Stat label="Sets" value={String(stats.sets)} />
          </View>
          <View style={styles.statsRow}>
            <Stat label="Reps" value={String(stats.reps)} />
            <Stat label="Volume (kg)" value={String(stats.volume)} />
            <Stat label="Exercises" value={String(stats.exercises)} />
          </View>
          <Text style={styles.intensityNote}>
            {INTENSITY_LABEL[workout.intensity]} intensity (MET {INTENSITY_MET[workout.intensity]})
            {workout.bodyWeightKg !== null ? ` · ${workout.bodyWeightKg} kg body weight` : ''}
          </Text>
        </Card>

        {workout.exercises.map((workoutExercise: WorkoutExercise) => (
          <Card key={workoutExercise.id} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{capitalize(workoutExercise.name)}</Text>
            {workoutExercise.sets.map((workoutSet: WorkoutSet, index: number) => (
              <View key={workoutSet.id} style={styles.setRow}>
                <Text style={styles.setNumber}>Set {index + 1}</Text>
                <Text style={[styles.setSummary, !workoutSet.done && styles.setSummarySkipped]}>
                  {workoutSet.reps} reps
                  {workoutSet.weight > 0 ? ` × ${workoutSet.weight} kg` : ''}
                </Text>
                {!workoutSet.done && <Text style={styles.skippedTag}>skipped</Text>}
              </View>
            ))}
          </Card>
        ))}

        {workout.exercises.length === 0 && (
          <Card>
            <SectionTitle>No exercises logged</SectionTitle>
          </Card>
        )}

        {canSaveAsRoutine && (
          <Button
            title="Save as routine"
            icon="bookmark-outline"
            variant={ButtonVariants.SECONDARY}
            onPress={handleSaveAsRoutine}
          />
        )}

        <Button
          title="Delete workout"
          icon="trash-outline"
          variant={ButtonVariants.GHOST}
          onPress={handleDelete}
        />
      </ScrollView>
    </>
  );
}
