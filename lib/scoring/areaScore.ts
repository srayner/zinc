export type TaskScoreInput = {
  /** Sub-score (1–10) for this task-on-area. */
  subScore: number;
  /** Relative weight; non-positive weights are ignored. */
  weight: number;
  /** On-hold tasks are excluded from scoring entirely. */
  onHold: boolean;
};

/**
 * Combine a set of task sub-scores into one computed Area score (1–10) via a
 * weighted average. Returns `null` when nothing applies (no tasks, or every
 * task is on hold, or all weights are non-positive) so the UI can render a
 * "not scored yet" state rather than a misleading number.
 */
export function computedAreaScore(inputs: TaskScoreInput[]): number | null {
  const active = inputs.filter((i) => !i.onHold && i.weight > 0);
  if (active.length === 0) return null;

  const totalWeight = active.reduce((sum, i) => sum + i.weight, 0);
  const weighted = active.reduce((sum, i) => sum + i.subScore * i.weight, 0);

  return weighted / totalWeight;
}
