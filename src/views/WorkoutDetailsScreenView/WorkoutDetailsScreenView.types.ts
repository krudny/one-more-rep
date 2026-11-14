import type { TextStyle, ViewStyle } from 'react-native';

export type WorkoutDetailsScreenViewProps = {
  workoutId: string;
};

export type WorkoutDetailsScreenViewStyles = {
  container: ViewStyle;
  title: TextStyle;
  mutedText: TextStyle;
  statsCard: ViewStyle;
  statsRow: ViewStyle;
  intensityNote: TextStyle;
  exerciseCard: ViewStyle;
  exerciseName: TextStyle;
  setRow: ViewStyle;
  setNumber: TextStyle;
  setSummary: TextStyle;
  setSummarySkipped: TextStyle;
  skippedTag: TextStyle;
};
