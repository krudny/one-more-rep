export const DEFAULT_BODY_PART = 'other';

// Dataset only includes target muscles, so body parts are derived here.
export const MUSCLE_TO_BODY_PART: Record<string, string> = {
  chest: 'chest',
  lats: 'back',
  'middle back': 'back',
  'lower back': 'back',
  traps: 'back',
  shoulders: 'shoulders',
  biceps: 'arms',
  triceps: 'arms',
  forearms: 'arms',
  abdominals: 'core',
  quadriceps: 'legs',
  hamstrings: 'legs',
  glutes: 'legs',
  calves: 'legs',
  abductors: 'legs',
  adductors: 'legs',
  neck: 'neck',
};
