import type { ReactElement } from 'react';
import { Text } from 'react-native';
import { useColors } from '@/theme';
import { createSectionTitleStyles } from './SectionTitle.styles';
import type { SectionTitleProps } from './SectionTitle.types';

export function SectionTitle({ children }: SectionTitleProps): ReactElement {
  const colors = useColors();
  const styles = createSectionTitleStyles(colors);
  return <Text style={styles.title}>{children}</Text>;
}
