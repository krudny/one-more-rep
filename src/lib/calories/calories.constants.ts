import type { Intensity } from '../types.ts';

export const Intensities = {
  LIGHT: 'light',
  MODERATE: 'moderate',
  VIGOROUS: 'vigorous',
} as const;

export const MILLISECONDS_PER_HOUR = 3_600_000;

export const INTENSITY_MET: Record<Intensity, number> = {
  [Intensities.LIGHT]: 3.5,
  [Intensities.MODERATE]: 5.0,
  [Intensities.VIGOROUS]: 6.0,
};

export const INTENSITY_LABEL: Record<Intensity, string> = {
  [Intensities.LIGHT]: 'Light',
  [Intensities.MODERATE]: 'Moderate',
  [Intensities.VIGOROUS]: 'Vigorous',
};

export const INTENSITY_LIST: readonly Intensity[] = [
  Intensities.LIGHT,
  Intensities.MODERATE,
  Intensities.VIGOROUS,
];
