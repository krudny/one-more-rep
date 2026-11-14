import type { ReactElement } from 'react';
import { ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { Stepper } from '@/components/Stepper/Stepper';
import { Button } from '@/components/Button/Button';
import { ButtonVariants } from '@/components/Button/Button.constants';
import { Card } from '@/components/Card/Card';
import { Chip } from '@/components/Chip/Chip';
import { SectionTitle } from '@/components/SectionTitle/SectionTitle';
import { useProfileCatalogRefresh } from '@/hooks/useProfileCatalogRefresh/useProfileCatalogRefresh';
import { INTENSITY_LABEL, INTENSITY_LIST, INTENSITY_MET } from '@/lib/calories/calories.constants';
import { estimateWorkoutCalories } from '@/lib/calories/calories';
import { formatCountdown } from '@/lib/format/format';
import type { Intensity } from '@/lib/types';
import { useAppStore } from '@/state/AppStore/AppStore';
import { useColors } from '@/theme';
import {
  BODY_WEIGHT_DECIMALS,
  BODY_WEIGHT_MIN_KG,
  BODY_WEIGHT_STEP_KG,
  MILLISECONDS_PER_HOUR,
  MILLISECONDS_PER_SECOND,
  REST_MIN_SECONDS,
  REST_STEP_SECONDS,
} from './ProfileScreenView.constants';
import { createProfileScreenViewStyles } from './ProfileScreenView.styles';

export function ProfileScreenView(): ReactElement {
  const colors = useColors();
  const styles = createProfileScreenViewStyles(colors);
  const { profile, updateProfile } = useAppStore();
  const { refreshing, handleRefreshCatalog } = useProfileCatalogRefresh();
  const hourlyCalories = estimateWorkoutCalories(
    profile.defaultIntensity,
    profile.weightKg,
    MILLISECONDS_PER_HOUR,
  );

  const renderToggleRow = (
    label: string,
    value: boolean,
    onValueChange: (nextValue: boolean) => void,
  ): ReactElement => (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.PRIMARY, false: colors.BORDER }}
        thumbColor={colors.PRIMARY_TEXT}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Card style={styles.card}>
        <SectionTitle>About you</SectionTitle>
        <TextInput
          value={profile.name}
          onChangeText={(name: string): void => updateProfile({ name })}
          placeholder="Your name (optional)"
          placeholderTextColor={colors.MUTED}
          style={styles.input}
        />
        <Stepper
          label="Body weight (kg)"
          value={profile.weightKg}
          step={BODY_WEIGHT_STEP_KG}
          decimals={BODY_WEIGHT_DECIMALS}
          min={BODY_WEIGHT_MIN_KG}
          onChange={(weightKg: number): void => updateProfile({ weightKg })}
        />
      </Card>

      <Card style={styles.card}>
        <SectionTitle>Default intensity</SectionTitle>
        <View style={styles.chips}>
          {INTENSITY_LIST.map((intensity: Intensity) => (
            <Chip
              key={intensity}
              label={`${INTENSITY_LABEL[intensity]} (MET ${INTENSITY_MET[intensity]})`}
              selected={profile.defaultIntensity === intensity}
              onPress={(): void => updateProfile({ defaultIntensity: intensity })}
            />
          ))}
        </View>
        <Text style={styles.mutedText}>
          Calories = MET × body weight (kg) × duration (h). At this setting you burn about{' '}
          {hourlyCalories} kcal per hour.
        </Text>
      </Card>

      <Card style={styles.card}>
        <SectionTitle>Rest timer</SectionTitle>
        <Stepper
          label={`Default rest (${formatCountdown(profile.restSeconds * MILLISECONDS_PER_SECOND)})`}
          value={profile.restSeconds}
          step={REST_STEP_SECONDS}
          min={REST_MIN_SECONDS}
          onChange={(restSeconds: number): void =>
            updateProfile({ restSeconds: Math.round(restSeconds) })
          }
        />
        {renderToggleRow(
          'Start rest after each set',
          profile.autoStartRest,
          (autoStartRest: boolean): void => updateProfile({ autoStartRest }),
        )}
        {renderToggleRow('Sound', profile.restSound, (restSound: boolean): void =>
          updateProfile({ restSound }),
        )}
        {renderToggleRow('Vibration', profile.restVibration, (restVibration: boolean): void =>
          updateProfile({ restVibration }),
        )}
      </Card>

      <Card style={styles.card}>
        <SectionTitle>Data</SectionTitle>
        <Text style={styles.mutedText}>
          Workouts are stored only on this device. The exercise catalog comes from the public-domain
          free-exercise-db dataset and is cached locally, so it works offline.
        </Text>
        <Button
          title="Update exercise catalog"
          variant={ButtonVariants.SECONDARY}
          loading={refreshing}
          onPress={handleRefreshCatalog}
        />
      </Card>
    </ScrollView>
  );
}
