import { useEffect, useState } from 'react';
import { DEMO_FRAME_INTERVAL_MS, MIN_ANIMATED_IMAGES } from './useExerciseDemo.constants';

export function useExerciseDemo(images: string[]): number {
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);

  useEffect(() => {
    setActiveFrameIndex(0);
    if (images.length < MIN_ANIMATED_IMAGES) {
      return;
    }
    const intervalId = setInterval(() => {
      setActiveFrameIndex((currentIndex: number) => (currentIndex + 1) % images.length);
    }, DEMO_FRAME_INTERVAL_MS);
    return (): void => clearInterval(intervalId);
  }, [images]);

  return activeFrameIndex;
}
