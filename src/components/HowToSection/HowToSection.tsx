import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, type ReactElement } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { ExerciseDemo } from '@/components/ExerciseDemo/ExerciseDemo';
import { InstructionSteps } from '@/components/InstructionSteps/InstructionSteps';
import { useExercise } from '@/hooks/useExercise/useExercise';
import { useColors } from '@/theme';
import { HOW_TO_HIT_SLOP, HOW_TO_ICON_SIZE } from './HowToSection.constants';
import { createHowToSectionStyles } from './HowToSection.styles';
import type { HowToSectionProps } from './HowToSection.types';

export function HowToSection({ exerciseId }: HowToSectionProps): ReactElement {
  const colors = useColors();
  const styles = createHowToSectionStyles(colors);
  const [open, setOpen] = useState(false);
  const { exercise, error } = useExercise(exerciseId, open);

  const renderDetails = (): ReactElement => {
    if (error) {
      return <Text style={styles.mutedText}>{error}</Text>;
    }
    if (!exercise) {
      return <ActivityIndicator color={colors.PRIMARY} />;
    }
    return (
      <>
        {exercise.images.length > 0 && <ExerciseDemo images={exercise.images} />}
        {exercise.instructions.length > 0 ? (
          <InstructionSteps steps={exercise.instructions} />
        ) : (
          <Text style={styles.mutedText}>No instructions available for this exercise.</Text>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={(): void => setOpen((currentOpen: boolean) => !currentOpen)}
        style={styles.toggle}
        hitSlop={HOW_TO_HIT_SLOP}
      >
        <Ionicons
          name="information-circle-outline"
          size={HOW_TO_ICON_SIZE}
          color={colors.PRIMARY}
        />
        <Text style={styles.toggleLabel}>How to do it</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={HOW_TO_ICON_SIZE}
          color={colors.PRIMARY}
        />
      </Pressable>

      {open && renderDetails()}
    </View>
  );
}
