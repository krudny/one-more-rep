/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { estimateCalories, estimateWorkoutCalories } from './calories.ts';
import { Intensities } from './calories.constants.ts';

test('MET formula: MET x kg x hours', () => {
  assert.equal(estimateCalories(5, 80, 3_600_000), 400);
  assert.equal(estimateCalories(6, 70, 30 * 60_000), 210);
});

test('invalid inputs give 0', () => {
  assert.equal(estimateCalories(5, 0, 3_600_000), 0);
  assert.equal(estimateCalories(5, 80, -1), 0);
  assert.equal(estimateCalories(Number.NaN, 80, 1000), 0);
});

test('intensity maps to MET', () => {
  assert.equal(estimateWorkoutCalories(Intensities.LIGHT, 100, 3_600_000), 350);
  assert.equal(estimateWorkoutCalories(Intensities.VIGOROUS, 100, 3_600_000), 600);
});
