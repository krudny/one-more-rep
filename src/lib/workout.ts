import type { Workout } from './types.ts';

export function elapsedMs(w: Pick<Workout, 'accumulatedMs' | 'resumedAt'>, now = Date.now()): number {
  return w.accumulatedMs + (w.resumedAt != null ? now - w.resumedAt : 0);
}

export function workoutStats(w: Workout) {
  let sets = 0;
  let reps = 0;
  let volume = 0;
  for (const ex of w.exercises) {
    for (const s of ex.sets) {
      if (!s.done) continue;
      sets += 1;
      reps += s.reps;
      volume += s.reps * s.weight;
    }
  }
  return { exercises: w.exercises.length, sets, reps, volume: Math.round(volume) };
}

export function defaultWorkoutName(ts: number): string {
  const h = new Date(ts).getHours();
  if (h < 12) return 'Morning workout';
  if (h < 17) return 'Afternoon workout';
  return 'Evening workout';
}
