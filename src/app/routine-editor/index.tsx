import { useLocalSearchParams } from 'expo-router';
import type { ReactElement } from 'react';
import { RoutineEditorScreenView } from '@/views/RoutineEditorScreenView/RoutineEditorScreenView';

export default function RoutineEditorScreen(): ReactElement {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <RoutineEditorScreenView routineId={id} />;
}
