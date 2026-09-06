export type ScoreBand = "critical" | "poor" | "fair" | "good" | "excellent" | "unscored";

/**
 * Map a 1–10 score to a band. The scale is honest across its full range — a
 * genuinely low score lands in `critical`, not a muted middle.
 */
export function scoreBand(score: number | null): ScoreBand {
  if (score === null) return "unscored";
  if (score <= 3) return "critical";
  if (score <= 5) return "poor";
  if (score <= 7) return "fair";
  if (score <= 8) return "good";
  return "excellent";
}

const BAND_CLASSES: Record<ScoreBand, string> = {
  critical: "bg-red-600 text-white",
  poor: "bg-orange-500 text-white",
  fair: "bg-amber-400 text-amber-950",
  good: "bg-lime-500 text-lime-950",
  excellent: "bg-green-600 text-white",
  unscored: "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300",
};

/** Tailwind classes for a score badge/pill. */
export function scoreColour(score: number | null): string {
  return BAND_CLASSES[scoreBand(score)];
}
