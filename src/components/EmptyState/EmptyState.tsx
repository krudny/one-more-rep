import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactElement } from 'react';
import { Text, View } from 'react-native';
import { useColors } from '@/theme';
import { EMPTY_STATE_ICON_SIZE } from './EmptyState.constants';
import { createEmptyStateStyles } from './EmptyState.styles';
import type { EmptyStateProps } from './EmptyState.types';

export function EmptyState({ icon, title, subtitle, children }: EmptyStateProps): ReactElement {
  const colors = useColors();
  const styles = createEmptyStateStyles(colors);

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={EMPTY_STATE_ICON_SIZE} color={colors.MUTED} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}
