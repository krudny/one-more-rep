import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { memo, type ReactElement } from 'react';
import { Pressable, Text, View, type PressableStateCallbackType } from 'react-native';
import { capitalize } from '@/lib/format/format';
import { useColors } from '@/theme';
import { ACTION_ICON_SIZE, CatalogActionIcons } from './ExerciseRow.constants';
import { createExerciseRowStyles, getExerciseRowOpacityStyle } from './ExerciseRow.styles';
import type { ExerciseRowProps } from './ExerciseRow.types';

function ExerciseRowComponent({ exercise, onPress, actionIcon }: ExerciseRowProps): ReactElement {
  const colors = useColors();
  const styles = createExerciseRowStyles(colors);
  const metadata = [exercise.targetMuscles[0], exercise.equipments[0], exercise.level]
    .filter((item: string | null | undefined): item is string => Boolean(item))
    .map(capitalize)
    .join(' · ');
  const iconColor = actionIcon === CatalogActionIcons.ADD_CIRCLE ? colors.PRIMARY : colors.MUTED;

  return (
    <Pressable
      onPress={(): void => onPress(exercise)}
      style={({ pressed }: PressableStateCallbackType) => [
        styles.row,
        getExerciseRowOpacityStyle(pressed),
      ]}
    >
      <Image
        source={exercise.images[0]}
        style={styles.thumb}
        contentFit="cover"
        cachePolicy="disk"
        recyclingKey={exercise.id}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {capitalize(exercise.name)}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {metadata}
        </Text>
      </View>
      <Ionicons name={actionIcon} size={ACTION_ICON_SIZE[actionIcon]} color={iconColor} />
    </Pressable>
  );
}

export const ExerciseRow = memo(ExerciseRowComponent);
