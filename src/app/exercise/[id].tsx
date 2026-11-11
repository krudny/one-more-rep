import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ExerciseDemo } from '@/components/ExerciseDemo';
import { InstructionSteps } from '@/components/ExerciseInstructions';
import { Button, Card, Chip, EmptyState, SectionTitle } from '@/components/ui';
import { capitalize } from '@/lib/format';
import type { Exercise } from '@/lib/types';
import { getExercise } from '@/services/exerciseApi';
import { useAppStore } from '@/state/AppStore';
import { spacing, useColors } from '@/theme';

export default function ExerciseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const { active, addExercise } = useAppStore();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    getExercise(id)
      .then((e) => !cancelled && setExercise(e))
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : 'Could not load exercise'));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) return <EmptyState icon="alert-circle-outline" title="Couldn't load exercise" subtitle={error} />;
  if (!exercise) return <ActivityIndicator style={{ marginTop: spacing.xl }} color={c.primary} />;

  const tags = (label: string, values: string[]) =>
    values.length > 0 && (
      <View style={{ gap: spacing.xs }}>
        <Text style={{ color: c.muted, fontSize: 13 }}>{label}</Text>
        <View style={styles.tags}>
          {values.map((v) => (
            <Chip key={v} label={capitalize(v)} />
          ))}
        </View>
      </View>
    );

  return (
    <>
      <Stack.Screen options={{ title: capitalize(exercise.name) }} />
      <ScrollView contentContainerStyle={styles.container}>
        {exercise.images.length > 0 && <ExerciseDemo images={exercise.images} />}
        <Text style={[styles.title, { color: c.text }]}>{capitalize(exercise.name)}</Text>

        {active && (
          <Button
            title="Add to current workout"
            icon="add"
            onPress={() => {
              addExercise(exercise);
              router.push('/workout');
            }}
          />
        )}

        <Card style={{ gap: spacing.md }}>
          {tags('Body part', exercise.bodyParts)}
          {tags('Target muscles', exercise.targetMuscles)}
          {tags('Secondary muscles', exercise.secondaryMuscles)}
          {tags('Equipment', exercise.equipments)}
          {tags('Level', exercise.level ? [exercise.level] : [])}
          {tags('Category', exercise.category ? [exercise.category] : [])}
        </Card>

        {exercise.instructions.length > 0 && (
          <Card style={{ gap: spacing.sm }}>
            <SectionTitle>How to do it</SectionTitle>
            <InstructionSteps steps={exercise.instructions} />
          </Card>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.lg },
  title: { fontSize: 24, fontWeight: '800' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
