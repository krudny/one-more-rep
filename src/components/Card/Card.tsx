import type { ReactElement } from 'react';
import { View } from 'react-native';
import { useColors } from '@/theme';
import { createCardStyles } from './Card.styles';
import type { CardProps } from './Card.types';

export function Card({ children, style }: CardProps): ReactElement {
  const colors = useColors();
  const styles = createCardStyles(colors);
  return <View style={[styles.card, style]}>{children}</View>;
}
