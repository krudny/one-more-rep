import { useLocalSearchParams } from 'expo-router';
import type { ReactElement } from 'react';
import { PickExerciseScreenView } from '@/views/PickExerciseScreenView/PickExerciseScreenView';

export default function PickExerciseScreen(): ReactElement {
  const { target } = useLocalSearchParams<{ target?: string }>();
  return <PickExerciseScreenView target={target} />;
}
