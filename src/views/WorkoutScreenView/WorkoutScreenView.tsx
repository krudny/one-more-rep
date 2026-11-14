import { Stack, router } from 'expo-router';
import type { ReactElement } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { ExerciseLogCard } from '@/components/ExerciseLogCard/ExerciseLogCard';
import { RestTimerBar } from '@/components/RestTimerBar/RestTimerBar';
import { Button } from '@/components/Button/Button';
import { ButtonVariants } from '@/components/Button/Button.constants';
import { Card } from '@/components/Card/Card';
import { Chip } from '@/components/Chip/Chip';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { IconButton } from '@/components/IconButton/IconButton';
import { useWorkoutScreen } from '@/hooks/useWorkoutScreen/useWorkoutScreen';
import { INTENSITY_LABEL, INTENSITY_LIST, INTENSITY_MET } from '@/lib/calories/calories.constants';
import { formatDuration } from '@/lib/format/format';
import type { Intensity, WorkoutExercise } from '@/lib/types';
import { useColors } from '@/theme';
import { PickExerciseTargets } from '@/views/PickExerciseScreenView/PickExerciseScreenView.constants';
import { KEYBOARD_VERTICAL_OFFSET_IOS } from './WorkoutScreenView.constants';
import { createWorkoutScreenViewStyles } from './WorkoutScreenView.styles';

export function WorkoutScreenView(): ReactElement | null {
  const colors = useColors();
  const styles = createWorkoutScreenViewStyles(colors);
  const {
    active,
    bodyWeightKg,
    elapsedMs,
    paused,
    estimatedCalories,
    togglePause,
    updateName,
    updateIntensity,
    handleFinishWorkout,
    handleDiscardWorkout,
  } = useWorkoutScreen();

  if (!active) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET_IOS}
    >
      <Stack.Screen
        options={{
          headerRight: (): ReactElement => (
            <IconButton
              icon="trash-outline"
              label="Discard workout"
              color={colors.DANGER}
              style={styles.headerRightButton}
              onPress={handleDiscardWorkout}
            />
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Card style={styles.headerCard}>
          <TextInput
            value={active.name}
            onChangeText={updateName}
            style={styles.nameInput}
            placeholder="Workout name"
            placeholderTextColor={colors.MUTED}
          />
          <View style={styles.clockRow}>
            <View style={styles.clockMetaColumn}>
              <Text style={[styles.clock, paused && styles.clockPaused]}>
                {formatDuration(elapsedMs)}
              </Text>
              {active.exercises.length > 0 && (
                <Text style={styles.mutedText}>
                  ≈ {estimatedCalories} kcal · MET {INTENSITY_MET[active.intensity]} ·{' '}
                  {bodyWeightKg} kg
                </Text>
              )}
            </View>
            <Button
              title={paused ? 'Resume' : 'Pause'}
              icon={paused ? 'play' : 'pause'}
              variant={ButtonVariants.SECONDARY}
              onPress={togglePause}
            />
          </View>
          <View style={styles.chips}>
            {INTENSITY_LIST.map((intensity: Intensity) => (
              <Chip
                key={intensity}
                label={INTENSITY_LABEL[intensity]}
                selected={active.intensity === intensity}
                onPress={(): void => updateIntensity(intensity)}
              />
            ))}
          </View>
        </Card>

        <RestTimerBar />

        {active.exercises.length === 0 ? (
          <EmptyState
            icon="barbell-outline"
            title="No exercises yet"
            subtitle="Add an exercise from the catalog to start logging sets."
          />
        ) : (
          active.exercises.map((workoutExercise: WorkoutExercise) => (
            <ExerciseLogCard key={workoutExercise.id} entry={workoutExercise} />
          ))
        )}

        <Button
          title="Add exercise"
          icon="add"
          variant={ButtonVariants.SECONDARY}
          onPress={(): void => router.push(`/pick-exercise?target=${PickExerciseTargets.WORKOUT}`)}
        />
        <Button title="Finish workout" icon="flag" onPress={handleFinishWorkout} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
