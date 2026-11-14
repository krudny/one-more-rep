import type { ReactElement } from 'react';
import { Text, View } from 'react-native';
import { useColors } from '@/theme';
import { createInstructionStepsStyles } from './InstructionSteps.styles';
import type { InstructionStepsProps } from './InstructionSteps.types';

export function InstructionSteps({ steps }: InstructionStepsProps): ReactElement {
  const colors = useColors();
  const styles = createInstructionStepsStyles(colors);

  return (
    <View style={styles.container}>
      {steps.map((step: string, index: number) => (
        <View key={`${index}-${step}`} style={styles.stepRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{index + 1}</Text>
          </View>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </View>
  );
}
