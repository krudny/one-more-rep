import type { FEATURES } from './features.constants.ts';

export type FeatureFlag = keyof typeof FEATURES;

export type FeatureFlagValues = Record<FeatureFlag, boolean>;

export type FeatureRequirements = Partial<Record<FeatureFlag, FeatureFlag[]>>;
