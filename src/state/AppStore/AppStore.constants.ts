import { Intensities } from '@/lib/calories/calories.constants';
import type { Profile } from '@/lib/types';

export const DEFAULT_WEIGHT_KG = 75;
export const DEFAULT_REST_SECONDS = 90;

export const DEFAULT_PROFILE: Profile = {
  name: '',
  weightKg: DEFAULT_WEIGHT_KG,
  defaultIntensity: Intensities.MODERATE,
  restSeconds: DEFAULT_REST_SECONDS,
  autoStartRest: true,
  restSound: true,
  restVibration: true,
};
