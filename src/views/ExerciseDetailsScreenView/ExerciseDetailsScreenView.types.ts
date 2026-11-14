import type { TextStyle, ViewStyle } from 'react-native';

export type ExerciseDetailsScreenViewProps = {
  exerciseId: string;
};

export type ExerciseDetailsScreenViewStyles = {
  loadingSpinner: ViewStyle;
  container: ViewStyle;
  title: TextStyle;
  detailsCard: ViewStyle;
  instructionsCard: ViewStyle;
  tagGroup: ViewStyle;
  tagLabel: TextStyle;
  tags: ViewStyle;
};
