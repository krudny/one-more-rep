import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Exercise } from '@/lib/types';
import { getExercise } from '@/services/exerciseApi';
import { spacing, useColors } from '@/theme';
import { ExerciseDemo } from './ExerciseDemo';

/** Numbered list of steps describing how to perform the exercise. */
export function InstructionSteps({ steps }: { steps: string[] }) {
  const c = useColors();
  return (
    <View style={{ gap: spacing.sm }}>
      {steps.map((step, i) => (
        <View key={i} style={styles.step}>
          <View style={[styles.badge, { backgroundColor: c.primary }]}>
            <Text style={[styles.badgeText, { color: c.primaryText }]}>{i + 1}</Text>
          </View>
          <Text style={{ color: c.text, flex: 1, lineHeight: 21 }}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

/** Collapsible "How to do it" section for the active workout. Loads the exercise on first open. */
export function HowToSection({ exerciseId }: { exerciseId: string }) {
  const c = useColors();
  const [open, setOpen] = useState(false);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || exercise) return;
    let cancelled = false;
    setError(null);
    getExercise(exerciseId)
      .then((e) => !cancelled && setExercise(e))
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : 'Could not load instructions'));
    return () => {
      cancelled = true;
    };
  }, [open, exercise, exerciseId]);

  return (
    <View style={{ gap: spacing.md }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((o) => !o)}
        style={styles.toggle}
        hitSlop={6}
      >
        <Ionicons name="information-circle-outline" size={18} color={c.primary} />
        <Text style={{ color: c.primary, fontWeight: '700', flex: 1 }}>How to do it</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={c.primary} />
      </Pressable>

      {open &&
        (error ? (
          <Text style={{ color: c.muted }}>{error}</Text>
        ) : !exercise ? (
          <ActivityIndicator color={c.primary} />
        ) : (
          <>
            {exercise.images.length > 0 && <ExerciseDemo images={exercise.images} />}
            {exercise.instructions.length > 0 ? (
              <InstructionSteps steps={exercise.instructions} />
            ) : (
              <Text style={{ color: c.muted }}>No instructions available for this exercise.</Text>
            )}
          </>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  step: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  badge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 0 },
  badgeText: { fontSize: 12, fontWeight: '800' },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
