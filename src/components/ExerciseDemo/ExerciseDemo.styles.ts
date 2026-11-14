import { StyleSheet, type ImageStyle, type StyleProp } from 'react-native';
import { RADIUS } from '@/theme';
import type { Colors } from '@/theme/theme.types';
import type { ExerciseDemoStyles } from './ExerciseDemo.types';

const DEMO_ASPECT_RATIO = 4 / 3;

export function createExerciseDemoStyles(colors: Colors): ExerciseDemoStyles {
  return StyleSheet.create({
    wrap: {
      width: '100%',
      aspectRatio: DEMO_ASPECT_RATIO,
      borderRadius: RADIUS.LG,
      overflow: 'hidden',
      backgroundColor: colors.CHIP,
    },
  });
}

export function getDemoImageStyle(isActive: boolean): StyleProp<ImageStyle> {
  return [StyleSheet.absoluteFill, { opacity: isActive ? 1 : 0 }];
}
