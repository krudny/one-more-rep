export const MORNING_END_HOUR = 12;
export const AFTERNOON_END_HOUR = 17;
export const DAYS_IN_WEEK = 7;
export const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
export const MILLISECONDS_PER_WEEK = DAYS_IN_WEEK * MILLISECONDS_PER_DAY;

export const WorkoutDefaultNames = {
  MORNING: 'Morning workout',
  AFTERNOON: 'Afternoon workout',
  EVENING: 'Evening workout',
} as const;
