import { Stack, router } from 'expo-router';
import type { ReactElement } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { ExerciseDemo } from '@/components/ExerciseDemo/ExerciseDemo';
import { InstructionSteps } from '@/components/InstructionSteps/InstructionSteps';
import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { Chip } from '@/components/Chip/Chip';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { SectionTitle } from '@/components/SectionTitle/SectionTitle';
import { useExercise } from '@/hooks/useExercise/useExercise';
import { capitalize } from '@/lib/format/format';
import { useAppStore } from '@/state/AppStore/AppStore';
import { useColors } from '@/theme';
import { createExerciseDetailsScreenViewStyles } from './ExerciseDetailsScreenView.styles';
import type { ExerciseDetailsScreenViewProps } from './ExerciseDetailsScreenView.types';

export function ExerciseDetailsScreenView({
  exerciseId,
}: ExerciseDetailsScreenViewProps): ReactElement {
  const colors = useColors();
  const styles = createExerciseDetailsScreenViewStyles(colors);
  const { active, addExercise } = useAppStore();
  const { exercise, error } = useExercise(exerciseId);

  if (error) {
    return (
      <EmptyState icon="alert-circle-outline" title="Couldn't load exercise" subtitle={error} />
    );
  }
  if (!exercise) {
    return <ActivityIndicator style={styles.loadingSpinner} color={colors.PRIMARY} />;
  }

  const renderTagGroup = (label: string, values: string[]): ReactElement | null => {
    if (values.length === 0) {
      return null;
    }
    return (
      <View style={styles.tagGroup}>
        <Text style={styles.tagLabel}>{label}</Text>
        <View style={styles.tags}>
          {values.map((tagValue: string) => (
            <Chip key={tagValue} label={capitalize(tagValue)} />
          ))}
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: capitalize(exercise.name) }} />
      <ScrollView contentContainerStyle={styles.container}>
        {exercise.images.length > 0 && <ExerciseDemo images={exercise.images} />}
        <Text style={styles.title}>{capitalize(exercise.name)}</Text>

        {active && (
          <Button
            title="Add to current workout"
            icon="add"
            onPress={(): void => {
              addExercise(exercise);
              router.push('/workout');
            }}
          />
        )}

        <Card style={styles.detailsCard}>
          {renderTagGroup('Body part', exercise.bodyParts)}
          {renderTagGroup('Target muscles', exercise.targetMuscles)}
          {renderTagGroup('Secondary muscles', exercise.secondaryMuscles)}
          {renderTagGroup('Equipment', exercise.equipments)}
          {renderTagGroup('Level', exercise.level ? [exercise.level] : [])}
          {renderTagGroup('Category', exercise.category ? [exercise.category] : [])}
        </Card>

        {exercise.instructions.length > 0 && (
          <Card style={styles.instructionsCard}>
            <SectionTitle>How to do it</SectionTitle>
            <InstructionSteps steps={exercise.instructions} />
          </Card>
        )}
      </ScrollView>
    </>
  );
}
