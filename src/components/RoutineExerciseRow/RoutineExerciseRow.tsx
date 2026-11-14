import { router } from 'expo-router';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card } from '@/components/Card/Card';
import { IconButton } from '@/components/IconButton/IconButton';
import { Stepper } from '@/components/Stepper/Stepper';
import { capitalize } from '@/lib/format/format';
import { MAX_SET_COUNT, MIN_SET_COUNT } from '@/lib/routine/routine.constants';
import { useColors } from '@/theme';
import { createRoutineExerciseRowStyles } from './RoutineExerciseRow.styles';
import type { RoutineExerciseRowProps } from './RoutineExerciseRow.types';

export function RoutineExerciseRow({
  entry,
  isFirst,
  isLast,
  onSetCountChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: RoutineExerciseRowProps): ReactElement {
  const colors = useColors();
  const styles = createRoutineExerciseRowStyles(colors);

  const subtitle = [entry.target, entry.equipment]
    .filter((item: string | null): item is string => Boolean(item))
    .map(capitalize)
    .join(' · ');

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Pressable
          style={styles.titleLink}
          onPress={(): void => router.push(`/exercise/${encodeURIComponent(entry.exerciseId)}`)}
        >
          <Text style={styles.name}>{capitalize(entry.name)}</Text>
          {subtitle.length > 0 && <Text style={styles.meta}>{subtitle}</Text>}
        </Pressable>
        <View style={styles.actions}>
          <IconButton
            icon="arrow-up"
            label="Move exercise up"
            disabled={isFirst}
            onPress={onMoveUp}
          />
          <IconButton
            icon="arrow-down"
            label="Move exercise down"
            disabled={isLast}
            onPress={onMoveDown}
          />
          <IconButton icon="trash-outline" label="Remove exercise" onPress={onRemove} />
        </View>
      </View>

      <View style={styles.stepperContainer}>
        <Stepper
          label="Sets"
          value={entry.setCount}
          min={MIN_SET_COUNT}
          max={MAX_SET_COUNT}
          onChange={onSetCountChange}
        />
      </View>
    </Card>
  );
}
