import type { TextStyle, ViewStyle } from 'react-native';

export type RoutineEditorScreenViewProps = {
  routineId?: string;
};

export type RoutineEditorScreenViewStyles = {
  keyboardContainer: ViewStyle;
  container: ViewStyle;
  nameCard: ViewStyle;
  fieldLabel: TextStyle;
  nameInput: TextStyle;
  errorBox: ViewStyle;
  errorText: TextStyle;
  bottomButtons: ViewStyle;
  headerLeftButton: ViewStyle;
};
