import type { Intensity } from './types.ts';

/**
 * MET values for resistance training, based on the
 * Compendium of Physical Activities.
 */
export const INTENSITY_MET: Record<Intensity, number> = {
  light: 3.5,
  moderate: 5.0,
  vigorous: 6.0,
};

export const INTENSITY_LABEL: Record<Intensity, string> = {
  light: 'Light',
  moderate: 'Moderate',
  vigorous: 'Vigorous',
};

export const INTENSITIES: Intensity[] = ['light', 'moderate', 'vigorous'];

/** Calories = MET x body weight (kg) x duration (hours) */
export function estimateCalories(met: number, weightKg: number, durationMs: number): number {
  if (!(met > 0) || !(weightKg > 0) || !(durationMs > 0)) return 0;
  const hours = durationMs / 3_600_000;
  return Math.round(met * weightKg * hours);
}

export function estimateWorkoutCalories(
  intensity: Intensity,
  weightKg: number,
  durationMs: number,
): number {
  return estimateCalories(INTENSITY_MET[intensity], weightKg, durationMs);
}
