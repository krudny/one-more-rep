import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, EmptyState, SectionTitle, Stat } from '@/components/ui';
import { INTENSITY_LABEL, INTENSITY_MET } from '@/lib/calories';
import { capitalize, formatDate, formatDuration, formatTime } from '@/lib/format';
import { workoutStats } from '@/lib/workout';
import { useAppStore } from '@/state/AppStore';
import { spacing, useColors } from '@/theme';

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const { workouts, deleteWorkout } = useAppStore();
  const workout = workouts.find((w) => w.id === id);

  if (!workout) return <EmptyState icon="alert-circle-outline" title="Workout not found" />;

  const stats = workoutStats(workout);

  const remove = () =>
    Alert.alert('Delete workout?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          router.back();
          deleteWorkout(workout.id);
        },
      },
    ]);

  return (
    <>
      <Stack.Screen options={{ title: workout.name }} />
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text style={[styles.title, { color: c.text }]}>{workout.name}</Text>
          <Text style={{ color: c.muted }}>
            {formatDate(workout.startedAt)}, {formatTime(workout.startedAt)}
            {workout.endedAt ? ` – ${formatTime(workout.endedAt)}` : ''}
          </Text>
        </View>

        <Card style={{ gap: spacing.lg }}>
          <View style={styles.stats}>
            <Stat label="Duration" value={formatDuration(workout.durationMs ?? 0)} />
            <Stat label="kcal" value={String(workout.calories ?? 0)} />
            <Stat label="Sets" value={String(stats.sets)} />
          </View>
          <View style={styles.stats}>
            <Stat label="Reps" value={String(stats.reps)} />
            <Stat label="Volume (kg)" value={String(stats.volume)} />
            <Stat label="Exercises" value={String(stats.exercises)} />
          </View>
          <Text style={{ color: c.muted, fontSize: 12, textAlign: 'center' }}>
            {INTENSITY_LABEL[workout.intensity]} intensity (MET {INTENSITY_MET[workout.intensity]})
            {workout.bodyWeightKg ? ` · ${workout.bodyWeightKg} kg body weight` : ''}
          </Text>
        </Card>

        {workout.exercises.map((e) => (
          <Card key={e.id} style={{ gap: spacing.sm }}>
            <Text style={[styles.exName, { color: c.text }]}>{capitalize(e.name)}</Text>
            {e.sets.map((s, i) => (
              <View key={s.id} style={styles.setRow}>
                <Text style={{ color: c.muted, width: 56 }}>Set {i + 1}</Text>
                <Text style={{ color: s.done ? c.text : c.muted, flex: 1, fontVariant: ['tabular-nums'] }}>
                  {s.reps} reps{s.weight > 0 ? ` × ${s.weight} kg` : ''}
                </Text>
                {!s.done && <Text style={{ color: c.muted, fontSize: 12 }}>skipped</Text>}
              </View>
            ))}
          </Card>
        ))}

        {workout.exercises.length === 0 && (
          <Card>
            <SectionTitle>No exercises logged</SectionTitle>
          </Card>
        )}

        <Button title="Delete workout" icon="trash-outline" variant="ghost" onPress={remove} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.lg },
  title: { fontSize: 24, fontWeight: '800' },
  stats: { flexDirection: 'row' },
  exName: { fontSize: 17, fontWeight: '700' },
  setRow: { flexDirection: 'row', alignItems: 'center' },
});
