import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { capitalize } from '@/lib/format';
import type { Exercise } from '@/lib/types';
import { getExercises, getFilterOptions, type ExerciseFilters } from '@/services/exerciseApi';
import { radius, spacing, useColors } from '@/theme';
import { Button, Chip, EmptyState } from './ui';

type FilterKey = 'bodyPart' | 'muscle' | 'equipment';
const FILTER_LABEL: Record<FilterKey, string> = { bodyPart: 'Body part', muscle: 'Target muscle', equipment: 'Equipment' };

type Props = {
  onSelect: (exercise: Exercise) => void;
  /** Shown on each row, e.g. "+" in picker mode. */
  actionIcon?: 'add-circle' | 'chevron-forward';
};

export function ExerciseCatalog({ onSelect, actionIcon = 'chevron-forward' }: Props) {
  const c = useColors();
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [filters, setFilters] = useState<Omit<ExerciseFilters, 'search'>>({});
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [options, setOptions] = useState<Record<FilterKey, string[]>>({ bodyPart: [], muscle: [], equipment: [] });

  const [items, setItems] = useState<Exercise[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const requestId = useRef(0);
  const optionsLoaded = useRef(false);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(id);
  }, [search]);


  const load = useCallback(
    async (reset: boolean) => {
      const id = ++requestId.current;
      setLoading(true);
      setError(null);
      try {
        const offset = reset ? 0 : items.length;
        const page = await getExercises({ ...filters, search: debounced }, offset);
        if (id !== requestId.current) return;
        setItems((prev) => {
          if (reset) return page.items;
          const seen = new Set(prev.map((e) => e.id));
          return [...prev, ...page.items.filter((e) => !seen.has(e.id))];
        });
        setHasMore(page.hasMore);
        setTotal(page.total);
        if (!optionsLoaded.current) {
          optionsLoaded.current = true;
          getFilterOptions()
            .then((o) => setOptions({ bodyPart: o.bodyParts, muscle: o.muscles, equipment: o.equipments }))
            .catch(() => {
              optionsLoaded.current = false;
            });
        }
      } catch (e) {
        if (id !== requestId.current) return;
        setError(e instanceof Error ? e.message : 'Could not load exercises');
        if (reset) setItems([]);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [filters, debounced, items.length],
  );

  // Reload when search or filters change.
  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, debounced]);

  const toggleFilter = (key: FilterKey, value: string) =>
    setFilters((f) => ({ ...f, [key]: f[key] === value ? undefined : value }));

  const renderItem = useCallback(
    ({ item }: { item: Exercise }) => <ExerciseRow exercise={item} onPress={onSelect} actionIcon={actionIcon} />,
    [onSelect, actionIcon],
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={[styles.search, { backgroundColor: c.card, borderColor: c.border }]}>
          <Ionicons name="search" size={18} color={c.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search exercises"
            placeholderTextColor={c.muted}
            style={{ flex: 1, color: c.text, fontSize: 16, paddingVertical: 10 }}
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {(Object.keys(FILTER_LABEL) as FilterKey[]).map((key) => (
            <Chip
              key={key}
              label={filters[key] ? `${FILTER_LABEL[key]}: ${capitalize(filters[key]!)}` : `${FILTER_LABEL[key]} ▾`}
              selected={openFilter === key || Boolean(filters[key])}
              onPress={() => setOpenFilter((o) => (o === key ? null : key))}
            />
          ))}
          {(filters.bodyPart || filters.muscle || filters.equipment) && (
            <Chip label="Clear" onPress={() => setFilters({})} />
          )}
        </ScrollView>
        {openFilter && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {options[openFilter].map((v) => (
              <Chip key={v} label={capitalize(v)} selected={filters[openFilter] === v} onPress={() => toggleFilter(openFilter, v)} />
            ))}
          </ScrollView>
        )}
        {total > 0 && <Text style={{ color: c.muted, fontSize: 12 }}>{total} exercises</Text>}
      </View>

      <FlatList
        data={items}
        keyExtractor={(e) => e.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, gap: spacing.sm, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!loading && hasMore && !error && items.length > 0) load(false);
        }}
        ListEmptyComponent={
          loading ? undefined : error ? (
            <EmptyState
              icon="cloud-offline-outline"
              title="Couldn't load exercises"
              subtitle={`${error}. The catalog is downloaded once and then works offline.`}
            >
              <Button title="Try again" onPress={() => load(true)} />
            </EmptyState>
          ) : (
            <EmptyState icon="barbell-outline" title="No exercises found" subtitle="Try a different search or filter." />
          )
        }
        ListFooterComponent={loading ? <ActivityIndicator style={{ margin: spacing.lg }} color={c.primary} /> : undefined}
      />
    </View>
  );
}

const ExerciseRow = memo(function ExerciseRow({
  exercise,
  onPress,
  actionIcon,
}: {
  exercise: Exercise;
  onPress: (e: Exercise) => void;
  actionIcon: 'add-circle' | 'chevron-forward';
}) {
  const c = useColors();
  const meta = [exercise.targetMuscles[0], exercise.equipments[0], exercise.level].filter(Boolean).map((s) => capitalize(s!));
  return (
    <Pressable
      onPress={() => onPress(exercise)}
      style={({ pressed }) => [styles.row, { backgroundColor: c.card, borderColor: c.border, opacity: pressed ? 0.8 : 1 }]}
    >
      <Image
        source={exercise.images[0]}
        style={[styles.thumb, { backgroundColor: c.chip }]}
        contentFit="cover"
        cachePolicy="disk"
        recyclingKey={exercise.id}
      />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.name, { color: c.text }]} numberOfLines={2}>
          {capitalize(exercise.name)}
        </Text>
        <Text style={{ color: c.muted, fontSize: 13 }} numberOfLines={1}>
          {meta.join(' · ')}
        </Text>
      </View>
      <Ionicons name={actionIcon} size={actionIcon === 'add-circle' ? 28 : 20} color={actionIcon === 'add-circle' ? c.primary : c.muted} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  header: { padding: spacing.lg, gap: spacing.sm },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
  },
  chips: { gap: spacing.sm, paddingVertical: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    paddingRight: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  thumb: { width: 56, height: 56, borderRadius: radius.sm },
  name: { fontSize: 16, fontWeight: '600' },
});
