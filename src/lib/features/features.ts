import { FEATURES, FEATURE_REQUIREMENTS } from './features.constants.ts';
import type { FeatureFlag, FeatureFlagValues, FeatureRequirements } from './features.types.ts';

function getFeatureFlagNames(values: FeatureFlagValues): FeatureFlag[] {
  return Object.keys(values).filter((name: string): name is FeatureFlag => name in values);
}

export function resolveFeatureFlags(
  values: FeatureFlagValues,
  requirements: FeatureRequirements,
): FeatureFlagValues {
  const resolved: Partial<FeatureFlagValues> = {};

  const resolveFlag = (name: FeatureFlag, visiting: Set<FeatureFlag>): boolean => {
    const known = resolved[name];
    if (known !== undefined) {
      return known;
    }
    if (visiting.has(name)) {
      return false; // dependency cycle: fail closed instead of looping
    }
    visiting.add(name);
    const required = requirements[name] ?? [];
    const enabled =
      values[name] &&
      required.every((requiredName: FeatureFlag) => resolveFlag(requiredName, visiting));
    resolved[name] = enabled;
    return enabled;
  };

  const result = { ...values };
  for (const name of getFeatureFlagNames(values)) {
    result[name] = resolveFlag(name, new Set());
  }
  return result;
}

export const flags: Readonly<FeatureFlagValues> = resolveFeatureFlags(
  FEATURES,
  FEATURE_REQUIREMENTS,
);
