import { clamp } from "@/lib/utils";

/**
 * How overdue a task is relative to its (seasonally adjusted) frequency.
 * 0 = just done, 1 = exactly due, > 1 = overdue.
 */
export function overdueRatio(
  daysSinceLastDone: number,
  adjustedFreqDays: number
): number {
  if (adjustedFreqDays <= 0) return 0;
  return Math.max(daysSinceLastDone, 0) / adjustedFreqDays;
}

/**
 * Condition sub-score (1–10) for a single task-on-area:
 *   sub_score = clamp(10 * (1 - overdue_ratio), 1, 10)
 */
export function subScore(
  daysSinceLastDone: number,
  adjustedFreqDays: number
): number {
  const ratio = overdueRatio(daysSinceLastDone, adjustedFreqDays);
  return clamp(10 * (1 - ratio), 1, 10);
}
