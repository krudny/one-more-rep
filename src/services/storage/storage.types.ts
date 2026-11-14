import type { StorageKeys } from './storage.constants';

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
