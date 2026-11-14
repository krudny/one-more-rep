import {
  MILLISECONDS_PER_SECOND,
  PAD_CHAR,
  PAD_LENGTH,
  RADIX_BASE_36,
  RANDOM_SLICE_END,
  RANDOM_SLICE_START,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
} from './format.constants.ts';

function padTwoDigits(value: number): string {
  return String(value).padStart(PAD_LENGTH, PAD_CHAR);
}

export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / MILLISECONDS_PER_SECOND));
  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  const minutes = Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  if (hours > 0) {
    return `${hours}:${padTwoDigits(minutes)}:${padTwoDigits(seconds)}`;
  }
  return `${padTwoDigits(minutes)}:${padTwoDigits(seconds)}`;
}

export function formatCountdown(milliseconds: number): string {
  const roundedMilliseconds =
    Math.ceil(Math.max(0, milliseconds) / MILLISECONDS_PER_SECOND) * MILLISECONDS_PER_SECOND;
  return formatDuration(roundedMilliseconds);
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function createUid(): string {
  const timestampPart = Date.now().toString(RADIX_BASE_36);
  const randomPart = Math.random()
    .toString(RADIX_BASE_36)
    .slice(RANDOM_SLICE_START, RANDOM_SLICE_END);
  return `${timestampPart}-${randomPart}`;
}
