import type { ReactElement } from 'react';
import { FlatList, type ListRenderItemInfo } from 'react-native';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { WorkoutRow } from '@/components/WorkoutRow/WorkoutRow';
import type { Workout } from '@/lib/types';
import { useAppStore } from '@/state/AppStore/AppStore';
import { historyScreenViewStyles } from './HistoryScreenView.styles';

export function HistoryScreenView(): ReactElement {
  const { workouts } = useAppStore();

  return (
    <FlatList
      data={workouts}
      keyExtractor={(workout: Workout): string => workout.id}
      renderItem={({ item }: ListRenderItemInfo<Workout>): ReactElement => (
        <WorkoutRow workout={item} />
      )}
      contentContainerStyle={historyScreenViewStyles.listContent}
      ListEmptyComponent={
        <EmptyState
          icon="time-outline"
          title="No workouts yet"
          subtitle="Finished workouts will show up here."
        />
      }
    />
  );
}
