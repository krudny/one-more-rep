import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FEATURES, FEATURE_REQUIREMENTS } from './features.constants.ts';
import { flags, resolveFeatureFlags } from './features.ts';
import type { FeatureFlagValues } from './features.types.ts';

const ALL_ON: FeatureFlagValues = { ...FEATURES };

test('requirements only reference existing flags', () => {
  for (const [name, required] of Object.entries(FEATURE_REQUIREMENTS)) {
    assert.ok(name in FEATURES, name);
    for (const requiredName of required) {
      assert.ok(requiredName in FEATURES, `${name} requires unknown ${requiredName}`);
    }
  }
});

test('with every flag on, every flag resolves to on', () => {
  assert.deepEqual(resolveFeatureFlags(ALL_ON, FEATURE_REQUIREMENTS), ALL_ON);
});

test('a flag is off when something it requires is off, also transitively', () => {
  const resolved = resolveFeatureFlags({ ...ALL_ON, workout: false }, FEATURE_REQUIREMENTS);
  assert.equal(resolved.stopwatch, false);
  assert.equal(resolved.restTimer, false);
  assert.equal(resolved.routines, false);
  assert.equal(resolved.weightTracking, false);
  assert.equal(resolved.calories, false, 'calories -> stopwatch -> workout');
  assert.equal(resolved.exercises, true);
  assert.equal(resolved.history, true);
});

test('turning off a flag does not affect flags that do not need it', () => {
  const resolved = resolveFeatureFlags({ ...ALL_ON, calories: false }, FEATURE_REQUIREMENTS);
  assert.equal(resolved.calories, false);
  assert.equal(resolved.stopwatch, true);
  assert.equal(resolved.workout, true);
});

test('dependency cycles fail closed instead of looping', () => {
  const resolved = resolveFeatureFlags(ALL_ON, { workout: ['history'], history: ['workout'] });
  assert.equal(resolved.workout, false);
  assert.equal(resolved.history, false);
});

test('exported flags are the resolved configured values', () => {
  assert.deepEqual(flags, resolveFeatureFlags(FEATURES, FEATURE_REQUIREMENTS));
});
