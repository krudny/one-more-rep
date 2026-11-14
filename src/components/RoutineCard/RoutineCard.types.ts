import type { TextStyle, ViewStyle } from 'react-native';
import type { Routine } from '@/lib/types';

export type RoutineCardProps = {
  routine: Routine;
  onStart: (routine: Routine) => void;
  onEdit: (routine: Routine) => void;
};

export type RoutineCardStyles = {
  card: ViewStyle;
  title: TextStyle;
  meta: TextStyle;
  actionsRow: ViewStyle;
  actionButton: ViewStyle;
};
