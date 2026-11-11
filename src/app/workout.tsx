import { Stack, router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ExerciseLogCard } from '@/components/ExerciseLogCard';
import { RestTimerBar } from '@/components/RestTimerBar';
import { Button, Card, Chip, EmptyState, IconButton } from '@/components/ui';
import { INTENSITIES, INTENSITY_LABEL, INTENSITY_MET, estimateWorkoutCalories } from '@/lib/calories';
import { formatDuration } from '@/lib/format';
import { useNow } from '@/lib/useNow';
import { elapsedMs } from '@/lib/workout';
import { useAppStore } from '@/state/AppStore';
import { useRestTimer } from '@/state/RestTimer';
import { spacing, useColors } from '@/theme';

export default function WorkoutScreen() {
  const c = useColors();
  const { active, profile, togglePause, updateActive, finishWorkout, discardWorkout } = useAppStore();
  const rest = useRestTimer();
  const now = useNow(500, active?.resumedAt != null);
  const finishing = useRef(false);

  // Leave the screen when the workout was discarded (finishing navigates by itself).
  useEffect(() => {
    if (!active && !finishing.current) router.back();
  }, [active]);

  if (!active) return null;

  const elapsed = elapsedMs(active, now);
  const paused = active.resumedAt == null;
  const kcal = estimateWorkoutCalories(active.intensity, profile.weightKg, elapsed);

  const finish = () => {
    const hasDoneSets = active.exercises.some((e) => e.sets.some((s) => s.done));
    Alert.alert(
      'Finish workout?',
      hasDoneSets ? 'Your workout will be saved to history.' : 'No sets are marked as done yet. Save anyway?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finish',
          onPress: () => {
            rest.stop();
            finishing.current = true;
            const saved = finishWorkout();
            if (saved) router.replace(`/history/${saved.id}`);
          },
        },
      ],
    );
  };

  const discard = () =>
    Alert.alert('Discard workout?', 'This workout will not be saved.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          rest.stop();
          discardWorkout();
        },
      },
    ]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
      <Stack.Screen
        options={{
          headerRight: () => <IconButton icon="trash-outline" label="Discard workout" color={c.danger} onPress={discard} />,
        }}
      />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Card style={{ gap: spacing.md }}>
          <TextInput
            value={active.name}
            onChangeText={(name) => updateActive({ name })}
            style={[styles.name, { color: c.text }]}
            placeholder="Workout name"
            placeholderTextColor={c.muted}
          />
          <View style={styles.clockRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.clock, { color: paused ? c.muted : c.text }]}>{formatDuration(elapsed)}</Text>
              <Text style={{ color: c.muted }}>
                ≈ {kcal} kcal · MET {INTENSITY_MET[active.intensity]} · {profile.weightKg} kg
              </Text>
            </View>
            <Button
              title={paused ? 'Resume' : 'Pause'}
              icon={paused ? 'play' : 'pause'}
              variant="secondary"
              onPress={togglePause}
            />
          </View>
          <View style={styles.chips}>
            {INTENSITIES.map((i) => (
              <Chip key={i} label={INTENSITY_LABEL[i]} selected={active.intensity === i} onPress={() => updateActive({ intensity: i })} />
            ))}
          </View>
        </Card>

        <RestTimerBar />

        {active.exercises.length === 0 ? (
          <EmptyState icon="barbell-outline" title="No exercises yet" subtitle="Add an exercise from the catalog to start logging sets." />
        ) : (
          active.exercises.map((e) => <ExerciseLogCard key={e.id} entry={e} />)
        )}

        <Button title="Add exercise" icon="add" variant="secondary" onPress={() => router.push('/pick-exercise')} />
        <Button title="Finish workout" icon="flag" onPress={finish} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 48 },
  name: { fontSize: 20, fontWeight: '700', padding: 0 },
  clockRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  clock: { fontSize: 44, fontWeight: '800', fontVariant: ['tabular-nums'] },
  chips: { flexDirection: 'row', gap: spacing.sm },
});
