import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Stepper } from '@/components/Stepper';
import { Button, Card, Chip, SectionTitle } from '@/components/ui';
import { INTENSITIES, INTENSITY_LABEL, INTENSITY_MET, estimateWorkoutCalories } from '@/lib/calories';
import { formatCountdown } from '@/lib/format';
import { refreshExercises } from '@/services/exerciseApi';
import { useAppStore } from '@/state/AppStore';
import { radius, spacing, useColors } from '@/theme';

export default function ProfileScreen() {
  const c = useColors();
  const { profile, updateProfile } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const hourly = estimateWorkoutCalories(profile.defaultIntensity, profile.weightKg, 3_600_000);

  const toggle = (label: string, value: boolean, onChange: (v: boolean) => void) => (
    <View style={styles.toggle}>
      <Text style={{ color: c.text, fontSize: 16, flex: 1 }}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: c.primary, false: c.border }} thumbColor="#FFFFFF" />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Card style={{ gap: spacing.md }}>
        <SectionTitle>About you</SectionTitle>
        <TextInput
          value={profile.name}
          onChangeText={(name) => updateProfile({ name })}
          placeholder="Your name (optional)"
          placeholderTextColor={c.muted}
          style={[styles.input, { color: c.text, borderColor: c.border, backgroundColor: c.background }]}
        />
        <Stepper
          label="Body weight (kg)"
          value={profile.weightKg}
          step={0.5}
          decimals={1}
          min={1}
          onChange={(weightKg) => updateProfile({ weightKg })}
        />
      </Card>

      <Card style={{ gap: spacing.md }}>
        <SectionTitle>Default intensity</SectionTitle>
        <View style={styles.chips}>
          {INTENSITIES.map((i) => (
            <Chip
              key={i}
              label={`${INTENSITY_LABEL[i]} (MET ${INTENSITY_MET[i]})`}
              selected={profile.defaultIntensity === i}
              onPress={() => updateProfile({ defaultIntensity: i })}
            />
          ))}
        </View>
        <Text style={{ color: c.muted }}>
          Calories = MET × body weight (kg) × duration (h). At this setting you burn about {hourly} kcal per hour.
        </Text>
      </Card>

      <Card style={{ gap: spacing.md }}>
        <SectionTitle>Rest timer</SectionTitle>
        <Stepper
          label={`Default rest (${formatCountdown(profile.restSeconds * 1000)})`}
          value={profile.restSeconds}
          step={15}
          min={15}
          onChange={(restSeconds) => updateProfile({ restSeconds: Math.round(restSeconds) })}
        />
        {toggle('Start rest after each set', profile.autoStartRest, (autoStartRest) => updateProfile({ autoStartRest }))}
        {toggle('Sound', profile.restSound, (restSound) => updateProfile({ restSound }))}
        {toggle('Vibration', profile.restVibration, (restVibration) => updateProfile({ restVibration }))}
      </Card>

      <Card style={{ gap: spacing.md }}>
        <SectionTitle>Data</SectionTitle>
        <Text style={{ color: c.muted }}>
          Workouts are stored only on this device. The exercise catalog comes from the public-domain
          free-exercise-db dataset and is cached locally, so it works offline.
        </Text>
        <Button
          title="Update exercise catalog"
          variant="secondary"
          loading={refreshing}
          onPress={async () => {
            setRefreshing(true);
            try {
              const count = await refreshExercises();
              Alert.alert('Catalog updated', `${count} exercises available.`);
            } catch (e) {
              Alert.alert('Update failed', e instanceof Error ? e.message : 'Check your connection and try again.');
            } finally {
              setRefreshing(false);
            }
          }}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.lg },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.md, padding: spacing.md, fontSize: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  toggle: { flexDirection: 'row', alignItems: 'center' },
});
