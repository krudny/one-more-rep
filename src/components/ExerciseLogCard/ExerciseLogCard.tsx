import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';
import { HowToSection } from '@/components/HowToSection/HowToSection';
import { Stepper } from '@/components/Stepper/Stepper';
import { Button } from '@/components/Button/Button';
import { ButtonVariants } from '@/components/Button/Button.constants';
import { Card } from '@/components/Card/Card';
import { IconButton } from '@/components/IconButton/IconButton';
import { useExerciseLogCard } from '@/hooks/useExerciseLogCard/useExerciseLogCard';
import { capitalize } from '@/lib/format/format';
import type { WorkoutSet } from '@/lib/types';
import { useColors } from '@/theme';
import {
  CHECK_HIT_SLOP,
  REMOVE_SET_ICON_SIZE,
  SET_CHECK_ICON_SIZE,
  WEIGHT_DECIMALS,
  WEIGHT_STEP_KG,
} from './ExerciseLogCard.constants';
import { createExerciseLogCardStyles } from './ExerciseLogCard.styles';
import type { ExerciseLogCardProps } from './ExerciseLogCard.types';

export function ExerciseLogCard({ entry }: ExerciseLogCardProps): ReactElement {
  const colors = useColors();
  const styles = createExerciseLogCardStyles(colors);
  const {
    selectedSet,
    selectedIndex,
    selectSet,
    completeSelectedSet,
    handleAddSet,
    handleUpdateSet,
    handleRemoveSet,
    handleRemoveExercise,
  } = useExerciseLogCard(entry);

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
        <IconButton icon="trash-outline" label="Remove exercise" onPress={handleRemoveExercise} />
      </View>

      <HowToSection exerciseId={entry.exerciseId} />

      <View style={styles.setsList}>
        {entry.sets.map((workoutSet: WorkoutSet, index: number) => {
          const isSelected = selectedSet !== null && selectedSet.id === workoutSet.id;
          return (
            <Pressable
              key={workoutSet.id}
              onPress={(): void => selectSet(workoutSet.id)}
              style={[styles.setRow, isSelected && styles.setRowSelected]}
            >
              <Text style={styles.setNo}>Set {index + 1}</Text>
              <Text style={styles.setValue}>
                {workoutSet.reps} reps{workoutSet.weight > 0 ? ` × ${workoutSet.weight} kg` : ''}
              </Text>
              <Pressable
                hitSlop={CHECK_HIT_SLOP}
                accessibilityLabel={workoutSet.done ? 'Mark set as not done' : 'Mark set as done'}
                onPress={(): void => handleUpdateSet(workoutSet.id, { done: !workoutSet.done })}
              >
                <Ionicons
                  name={workoutSet.done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={SET_CHECK_ICON_SIZE}
                  color={workoutSet.done ? colors.SUCCESS : colors.MUTED}
                />
              </Pressable>
              <IconButton
                icon="close"
                size={REMOVE_SET_ICON_SIZE}
                label="Remove set"
                onPress={(): void => handleRemoveSet(workoutSet.id)}
              />
            </Pressable>
          );
        })}
      </View>

      {selectedSet && (
        <View style={styles.editor}>
          <Text style={styles.editorTitle}>Set {selectedIndex + 1}</Text>
          <Stepper
            large
            label="Reps"
            value={selectedSet.reps}
            onChange={(reps: number): void => handleUpdateSet(selectedSet.id, { reps })}
          />
          <Stepper
            label="Weight (kg)"
            value={selectedSet.weight}
            step={WEIGHT_STEP_KG}
            decimals={WEIGHT_DECIMALS}
            onChange={(weight: number): void => handleUpdateSet(selectedSet.id, { weight })}
          />
          {!selectedSet.done && (
            <Button
              title="Complete set"
              icon="checkmark"
              onPress={completeSelectedSet}
              style={styles.completeButton}
            />
          )}
        </View>
      )}

      <Button
        title="Add set"
        icon="add"
        variant={ButtonVariants.SECONDARY}
        onPress={handleAddSet}
      />
    </Card>
  );
}
