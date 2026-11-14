import { Image } from 'expo-image';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { useExerciseDemo } from '@/hooks/useExerciseDemo/useExerciseDemo';
import { useColors } from '@/theme';
import { createExerciseDemoStyles, getDemoImageStyle } from './ExerciseDemo.styles';
import type { ExerciseDemoProps } from './ExerciseDemo.types';

export function ExerciseDemo({ images }: ExerciseDemoProps): ReactElement {
  const colors = useColors();
  const styles = createExerciseDemoStyles(colors);
  const activeFrameIndex = useExerciseDemo(images);

  return (
    <View style={styles.wrap}>
      {images.map((imageUri: string, index: number) => (
        <Image
          key={imageUri}
          source={imageUri}
          style={getDemoImageStyle(index === activeFrameIndex)}
          contentFit="contain"
          cachePolicy="disk"
          accessibilityLabel={`Exercise demo, step ${index + 1}`}
        />
      ))}
    </View>
  );
}
