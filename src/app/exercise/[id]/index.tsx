import { useLocalSearchParams } from 'expo-router';
import type { ReactElement } from 'react';
import { ExerciseDetailsScreenView } from '@/views/ExerciseDetailsScreenView/ExerciseDetailsScreenView';

export default function ExerciseDetailsScreen(): ReactElement {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ExerciseDetailsScreenView exerciseId={id} />;
}
