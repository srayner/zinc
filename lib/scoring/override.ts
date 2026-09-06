import { clamp } from "@/lib/utils";

/**
 * A manual Area score override decays from its stated value using the same
 * shape as a task sub-score, over the area's mean adjusted frequency as the
 * decay period.
 */
export function decayedOverrideScore(
  overrideScore: number,
  overrideAgeDays: number,
  areaMeanAdjustedFreqDays: number
): number {
  if (areaMeanAdjustedFreqDays <= 0) return clamp(overrideScore, 1, 10);
  const ratio = Math.max(overrideAgeDays, 0) / areaMeanAdjustedFreqDays;
  return clamp(overrideScore * (1 - ratio), 1, 10);
}

export type CurrentAreaScoreInput = {
  /** Computed (time-decay) score, or null when no active tasks. */
  computed: number | null;
  /**
   * Latest manual override, if any. `supersededByLog` is true once any log
   * entry for the area has been recorded after the override was set — at which
   * point the computed score takes over again.
   */
  override?: {
    score: number;
    ageDays: number;
    areaMeanAdjustedFreqDays: number;
    supersededByLog: boolean;
  };
};

export type CurrentAreaScore = {
  value: number | null;
  source: "computed" | "override" | "none";
};

/**
 * Resolve the score to display for an Area: the decayed manual override while
 * it is still authoritative, otherwise the computed score.
 */
export function currentAreaScore(input: CurrentAreaScoreInput): CurrentAreaScore {
  const { computed, override } = input;

  if (override && !override.supersededByLog) {
    return {
      value: decayedOverrideScore(
        override.score,
        override.ageDays,
        override.areaMeanAdjustedFreqDays
      ),
      source: "override",
    };
  }

  if (computed === null) return { value: null, source: "none" };
  return { value: computed, source: "computed" };
}
