/** Neutral (no seasonal adjustment) multiplier set. */
export const NEUTRAL_SEASONAL_MULTIPLIERS: number[] = Array(12).fill(1);

/**
 * Adjust a base frequency (in days) by the seasonal multiplier for the month of
 * `onDate`. A multiplier > 1 lengthens the interval (task needed less often);
 * < 1 shortens it (needed more often).
 *
 * Any non-length-12 array, or a non-positive / non-finite multiplier, is treated
 * as neutral so bad data never breaks scoring.
 */
export function adjustedFrequencyDays(
  baseDays: number,
  seasonalMultipliers: number[] | null | undefined,
  onDate: Date
): number {
  const multipliers =
    seasonalMultipliers && seasonalMultipliers.length === 12
      ? seasonalMultipliers
      : NEUTRAL_SEASONAL_MULTIPLIERS;

  const raw = multipliers[onDate.getMonth()];
  const multiplier = Number.isFinite(raw) && raw > 0 ? raw : 1;

  return baseDays * multiplier;
}
