import type { ReactElement } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/Button/Button';
import { ButtonVariants } from '@/components/Button/Button.constants';
import { Card } from '@/components/Card/Card';
import { getRoutineTotalSets } from '@/lib/routine/routine';
import { useColors } from '@/theme';
import { createRoutineCardStyles } from './RoutineCard.styles';
import type { RoutineCardProps } from './RoutineCard.types';

export function RoutineCard({ routine, onStart, onEdit }: RoutineCardProps): ReactElement {
  const colors = useColors();
  const styles = createRoutineCardStyles(colors);
  const exerciseCount = routine.exercises.length;
  const totalSets = getRoutineTotalSets(routine);

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{routine.name}</Text>
      <Text style={styles.meta}>
        {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'} · {totalSets}{' '}
        {totalSets === 1 ? 'set' : 'sets'}
      </Text>
      <View style={styles.actionsRow}>
        <Button
          title="Start"
          icon="play"
          onPress={(): void => onStart(routine)}
          style={styles.actionButton}
        />
        <Button
          title="Edit"
          icon="create-outline"
          variant={ButtonVariants.SECONDARY}
          onPress={(): void => onEdit(routine)}
          style={styles.actionButton}
        />
      </View>
    </Card>
  );
}
