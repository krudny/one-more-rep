import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '@/components/ui';
import { formatDate, formatDuration, formatTime } from '@/lib/format';
import type { Workout } from '@/lib/types';
import { workoutStats } from '@/lib/workout';
import { useAppStore } from '@/state/AppStore';
import { radius, spacing, useColors } from '@/theme';

export default function HistoryScreen() {
  const { workouts } = useAppStore();
  return (
    <FlatList
      data={workouts}
      keyExtractor={(w) => w.id}
      renderItem={({ item }) => <WorkoutRow workout={item} />}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm, flexGrow: 1 }}
      ListEmptyComponent={
        <EmptyState icon="time-outline" title="No workouts yet" subtitle="Finished workouts will show up here." />
      }
    />
  );
}

function WorkoutRow({ workout }: { workout: Workout }) {
  const c = useColors();
  const stats = workoutStats(workout);
  return (
    <Pressable
      onPress={() => router.push(`/history/${workout.id}`)}
      style={({ pressed }) => [styles.row, { backgroundColor: c.card, borderColor: c.border, opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.title, { color: c.text }]}>{workout.name}</Text>
        <Text style={{ color: c.muted, fontSize: 13 }}>
          {formatDate(workout.startedAt)}, {formatTime(workout.startedAt)}
        </Text>
        <Text style={{ color: c.muted, fontSize: 13 }}>
          {formatDuration(workout.durationMs ?? 0)} · {stats.exercises} exercises · {stats.sets} sets · {workout.calories ?? 0} kcal
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={c.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 16, fontWeight: '700' },
});
