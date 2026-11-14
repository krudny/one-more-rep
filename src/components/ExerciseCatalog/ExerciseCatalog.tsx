import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, type ReactElement } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TextInput,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { ExerciseRow } from '@/components/ExerciseRow/ExerciseRow';
import { CatalogActionIcons } from '@/components/ExerciseRow/ExerciseRow.constants';
import { Button } from '@/components/Button/Button';
import { Chip } from '@/components/Chip/Chip';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { useExerciseCatalog } from '@/hooks/useExerciseCatalog/useExerciseCatalog';
import {
  FILTER_KEY_LIST,
  FILTER_LABELS,
} from '@/hooks/useExerciseCatalog/useExerciseCatalog.constants';
import type { FilterKey } from '@/hooks/useExerciseCatalog/useExerciseCatalog.types';
import { capitalize } from '@/lib/format/format';
import type { Exercise } from '@/lib/types';
import { useColors } from '@/theme';
import { LIST_END_REACHED_THRESHOLD, SEARCH_ICON_SIZE } from './ExerciseCatalog.constants';
import { createExerciseCatalogStyles } from './ExerciseCatalog.styles';
import type { ExerciseCatalogProps } from './ExerciseCatalog.types';

export function ExerciseCatalog({
  onSelect,
  actionIcon = CatalogActionIcons.CHEVRON_FORWARD,
}: ExerciseCatalogProps): ReactElement {
  const colors = useColors();
  const styles = createExerciseCatalogStyles(colors);
  const {
    search,
    setSearch,
    filters,
    openFilter,
    options,
    items,
    loading,
    error,
    total,
    hasActiveFilters,
    toggleOpenFilter,
    toggleFilterValue,
    clearFilters,
    reloadExercises,
    loadMoreExercises,
  } = useExerciseCatalog();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Exercise>): ReactElement => (
      <ExerciseRow exercise={item} onPress={onSelect} actionIcon={actionIcon} />
    ),
    [onSelect, actionIcon],
  );

  const renderEmptyState = (): ReactElement | undefined => {
    if (loading) return undefined;
    if (error) {
      return (
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load exercises"
          subtitle={`${error}. The catalog is downloaded once and then works offline.`}
        >
          <Button title="Try again" onPress={reloadExercises} />
        </EmptyState>
      );
    }
    return (
      <EmptyState
        icon="barbell-outline"
        title="No exercises found"
        subtitle="Try a different search or filter."
      />
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={SEARCH_ICON_SIZE} color={colors.MUTED} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={total > 0 ? `Search ${total} exercises` : 'Search exercises'}
            placeholderTextColor={colors.MUTED}
            style={styles.searchInput}
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {FILTER_KEY_LIST.map((filterKey: FilterKey) => {
            const selectedValue = filters[filterKey];
            const label = selectedValue
              ? `${FILTER_LABELS[filterKey]}: ${capitalize(selectedValue)}`
              : `${FILTER_LABELS[filterKey]} ▾`;
            return (
              <Chip
                key={filterKey}
                label={label}
                selected={openFilter === filterKey || Boolean(selectedValue)}
                onPress={(): void => toggleOpenFilter(filterKey)}
              />
            );
          })}
          {hasActiveFilters && <Chip label="Clear" onPress={clearFilters} />}
        </ScrollView>
        {openFilter && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {options[openFilter].map((optionValue: string) => (
              <Chip
                key={optionValue}
                label={capitalize(optionValue)}
                selected={filters[openFilter] === optionValue}
                onPress={(): void => toggleFilterValue(openFilter, optionValue)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(exercise: Exercise): string => exercise.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        onEndReachedThreshold={LIST_END_REACHED_THRESHOLD}
        onEndReached={loadMoreExercises}
        ListEmptyComponent={renderEmptyState()}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator style={styles.footerSpinner} color={colors.PRIMARY} />
          ) : undefined
        }
      />
    </View>
  );
}
