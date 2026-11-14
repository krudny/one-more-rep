import { useLocalSearchParams } from 'expo-router';
import type { ReactElement } from 'react';
import { WorkoutDetailsScreenView } from '@/views/WorkoutDetailsScreenView/WorkoutDetailsScreenView';

export default function WorkoutDetailsScreen(): ReactElement {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <WorkoutDetailsScreenView workoutId={id} />;
}
