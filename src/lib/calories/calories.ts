import type { Intensity } from '../types.ts';
import { INTENSITY_MET, MILLISECONDS_PER_HOUR } from './calories.constants.ts';

export function estimateCalories(met: number, weightKg: number, durationMs: number): number {
  if (!(met > 0) || !(weightKg > 0) || !(durationMs > 0)) {
    return 0;
  }
  const hours = durationMs / MILLISECONDS_PER_HOUR;
  return Math.round(met * weightKg * hours);
}

export function estimateWorkoutCalories(
  intensity: Intensity,
  weightKg: number,
  durationMs: number,
): number {
  return estimateCalories(INTENSITY_MET[intensity], weightKg, durationMs);
}
