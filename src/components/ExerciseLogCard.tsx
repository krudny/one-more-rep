import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { capitalize } from '@/lib/format';
import type { WorkoutExercise } from '@/lib/types';
import { useAppStore } from '@/state/AppStore';
import { useRestTimer } from '@/state/RestTimer';
import { radius, spacing, useColors } from '@/theme';
import { HowToSection } from './ExerciseInstructions';
import { Stepper } from './Stepper';
import { Button, Card, IconButton } from './ui';

/** One exercise in the active workout: list of sets plus a big rep counter for the selected set. */
export function ExerciseLogCard({ entry }: { entry: WorkoutExercise }) {
  const c = useColors();
  const { profile, addSet, updateSet, removeSet, removeExercise } = useAppStore();
  const rest = useRestTimer();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected =
    entry.sets.find((s) => s.id === selectedId) ?? entry.sets.find((s) => !s.done) ?? null;
  const selectedIndex = selected ? entry.sets.indexOf(selected) : -1;

  const complete = () => {
    if (!selected) return;
    updateSet(entry.id, selected.id, { done: true });
    setSelectedId(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (profile.autoStartRest) rest.start();
  };

  return (
    <Card style={{ gap: spacing.md }}>
      <View style={styles.header}>
        <Pressable style={{ flex: 1 }} onPress={() => router.push(`/exercise/${encodeURIComponent(entry.exerciseId)}`)}>
          <Text style={[styles.name, { color: c.text }]}>{capitalize(entry.name)}</Text>
          {(entry.target || entry.equipment) && (
            <Text style={{ color: c.muted, fontSize: 13 }}>
              {[entry.target, entry.equipment].filter(Boolean).map((s) => capitalize(s!)).join(' · ')}
            </Text>
          )}
        </Pressable>
        <IconButton icon="trash-outline" label="Remove exercise" onPress={() => removeExercise(entry.id)} />
      </View>

      <HowToSection exerciseId={entry.exerciseId} />

      <View style={{ gap: spacing.xs }}>
        {entry.sets.map((s, i) => {
          const isSelected = selected?.id === s.id;
          return (
            <Pressable
              key={s.id}
              onPress={() => setSelectedId(s.id)}
              style={[
                styles.setRow,
                { backgroundColor: isSelected ? c.chip : 'transparent', borderColor: isSelected ? c.primary : c.border },
              ]}
            >
              <Text style={[styles.setNo, { color: c.muted }]}>Set {i + 1}</Text>
              <Text style={[styles.setValue, { color: c.text }]}>
                {s.reps} reps{s.weight > 0 ? ` × ${s.weight} kg` : ''}
              </Text>
              <Pressable
                hitSlop={8}
                accessibilityLabel={s.done ? 'Mark set as not done' : 'Mark set as done'}
                onPress={() => updateSet(entry.id, s.id, { done: !s.done })}
              >
                <Ionicons
                  name={s.done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={26}
                  color={s.done ? c.success : c.muted}
                />
              </Pressable>
              <IconButton icon="close" size={18} label="Remove set" onPress={() => removeSet(entry.id, s.id)} />
            </Pressable>
          );
        })}
      </View>

      {selected && (
        <View style={[styles.editor, { borderColor: c.border }]}>
          <Text style={{ color: c.muted, fontWeight: '700' }}>Set {selectedIndex + 1}</Text>
          <Stepper large label="Reps" value={selected.reps} onChange={(reps) => updateSet(entry.id, selected.id, { reps })} />
          <Stepper
            label="Weight (kg)"
            value={selected.weight}
            step={2.5}
            decimals={2}
            onChange={(weight) => updateSet(entry.id, selected.id, { weight })}
          />
          {!selected.done && <Button title="Complete set" icon="checkmark" onPress={complete} style={{ alignSelf: 'stretch' }} />}
        </View>
      )}

      <Button title="Add set" icon="add" variant="secondary" onPress={() => addSet(entry.id)} />
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  name: { fontSize: 17, fontWeight: '700' },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  setNo: { width: 48, fontWeight: '600' },
  setValue: { flex: 1, fontSize: 16, fontWeight: '600', fontVariant: ['tabular-nums'] },
  editor: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
