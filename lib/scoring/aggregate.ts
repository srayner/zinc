/**
 * Roll a set of child scores up to a parent score (Area → Zone, Zone → overall)
 * by taking the mean of the non-null values. Returns `null` when every child is
 * unscored.
 */
export function rollUp(scores: (number | null)[]): number | null {
  const present = scores.filter((s): s is number => s !== null);
  if (present.length === 0) return null;
  return present.reduce((sum, s) => sum + s, 0) / present.length;
}
