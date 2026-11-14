import type { ReactElement } from 'react';
import { Text, View } from 'react-native';
import { useColors } from '@/theme';
import { createStatStyles } from './Stat.styles';
import type { StatProps } from './Stat.types';

export function Stat({ label, value }: StatProps): ReactElement {
  const colors = useColors();
  const styles = createStatStyles(colors);

  return (
    <View style={styles.stat}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
