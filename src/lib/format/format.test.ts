/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { capitalize, createUid, formatCountdown, formatDuration } from './format.ts';

test('duration formatting', () => {
  assert.equal(formatDuration(75_000), '01:15');
  assert.equal(formatDuration(3_725_000), '1:02:05');
  assert.equal(formatCountdown(500), '00:01');
  assert.equal(formatCountdown(0), '00:00');
});

test('capitalize uppercases first letter', () => {
  assert.equal(capitalize('barbell squat'), 'Barbell squat');
  assert.equal(capitalize(''), '');
});

test('createUid generates non-empty unique identifiers', () => {
  const firstId = createUid();
  const secondId = createUid();
  assert.ok(firstId.length > 0);
  assert.notEqual(firstId, secondId);
});
