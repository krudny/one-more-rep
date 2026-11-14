import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ReactElement } from 'react';
import { Pressable, Text, View, type PressableStateCallbackType } from 'react-native';
import { formatDate, formatDuration, formatTime } from '@/lib/format/format';
import { getWorkoutStats } from '@/lib/workout/workout';
import { useColors } from '@/theme';
import { WORKOUT_ROW_ICON_SIZE } from './WorkoutRow.constants';
import { createWorkoutRowStyles, getWorkoutRowOpacityStyle } from './WorkoutRow.styles';
import type { WorkoutRowProps } from './WorkoutRow.types';

export function WorkoutRow({ workout }: WorkoutRowProps): ReactElement {
  const colors = useColors();
  const styles = createWorkoutRowStyles(colors);
  const stats = getWorkoutStats(workout);

  return (
    <Pressable
      onPress={(): void => router.push(`/history/${workout.id}`)}
      style={({ pressed }: PressableStateCallbackType) => [
        styles.row,
        getWorkoutRowOpacityStyle(pressed),
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{workout.name}</Text>
        <Text style={styles.meta}>
          {formatDate(workout.startedAt)}, {formatTime(workout.startedAt)}
        </Text>
        <Text style={styles.meta}>
          {formatDuration(workout.durationMs)} · {stats.exercises} exercises · {stats.sets} sets ·{' '}
          {workout.calories} kcal
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={WORKOUT_ROW_ICON_SIZE} color={colors.MUTED} />
    </Pressable>
  );
}
