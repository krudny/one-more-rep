import type { ReactElement } from 'react';
import { Pressable, Text } from 'react-native';
import { useColors } from '@/theme';
import { createChipStyles } from './Chip.styles';
import type { ChipProps } from './Chip.types';

export function Chip({ label, selected, onPress }: ChipProps): ReactElement {
  const colors = useColors();
  const styles = createChipStyles(colors, Boolean(selected));

  return (
    <Pressable onPress={onPress} style={styles.chip} accessibilityState={{ selected }}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
