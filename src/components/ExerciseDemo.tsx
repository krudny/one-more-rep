import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { radius, useColors } from '@/theme';

const FRAME_MS = 900;

/** Loops through the exercise's start/end images to show the movement. */
export function ExerciseDemo({ images }: { images: string[] }) {
  const c = useColors();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    setFrame(0);
    if (images.length < 2) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % images.length), FRAME_MS);
    return () => clearInterval(id);
  }, [images]);

  return (
    <View style={[styles.wrap, { backgroundColor: c.chip }]}>
      {images.map((uri, i) => (
        <Image
          key={uri}
          source={uri}
          style={[StyleSheet.absoluteFill, { opacity: i === frame ? 1 : 0 }]}
          contentFit="contain"
          cachePolicy="disk"
          accessibilityLabel={`Exercise demo, step ${i + 1}`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.lg, overflow: 'hidden' },
});
