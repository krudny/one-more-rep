import type { FeatureRequirements } from './features.types.ts';

export const FEATURES = {
  // Screens
  workout: true, // active workout screen and exercise picker
  routines: true, // "My routines" on Home and the routine editor
  exercises: true, // Exercises tab
  exerciseDetails: true, // exercise details screen
  history: true, // History tab, workout details, "Last workout" card
  profile: true, // Profile tab

  // Workout
  stopwatch: true, // workout time and pause; durations everywhere
  restTimer: true, // rest countdown and its Profile settings
  calories: true, // kcal estimate, intensity, body weight
  weightTracking: true, // weight per set and volume; off = reps only

  // Exercise catalog
  instructions: true, // "How to do it" steps
  exerciseImages: true, // thumbnails and demo images
  catalogSearch: true, // search box
  catalogFilters: true, // body part / muscle / equipment filters

  // General
  weeklyStats: true, // "Last 7 days" card on Home
  haptics: true, // haptic feedback on steppers and completed sets
  darkMode: true, // follow the system dark theme; off = always light
} as const;

export const FEATURE_REQUIREMENTS: FeatureRequirements = {
  routines: ['workout'],
  stopwatch: ['workout'],
  restTimer: ['workout'],
  calories: ['stopwatch'],
  weightTracking: ['workout'],
};
