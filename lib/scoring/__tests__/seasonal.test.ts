import { describe, expect, it } from "vitest";
import { adjustedFrequencyDays } from "@/lib/scoring/seasonal";

const JUNE = new Date(2026, 5, 15);
const JANUARY = new Date(2026, 0, 15);

describe("adjustedFrequencyDays", () => {
  it("shortens the interval when the summer multiplier is < 1", () => {
    const grass = [3, 3, 1.5, 1, 0.6, 0.5, 0.5, 0.6, 0.9, 1.5, 2.5, 3];
    expect(adjustedFrequencyDays(14, grass, JUNE)).toBe(7);
  });

  it("lengthens the interval when the winter multiplier is > 1", () => {
    const grass = [3, 3, 1.5, 1, 0.6, 0.5, 0.5, 0.6, 0.9, 1.5, 2.5, 3];
    expect(adjustedFrequencyDays(14, grass, JANUARY)).toBe(42);
  });

  it("treats a neutral array as no adjustment", () => {
    expect(adjustedFrequencyDays(10, Array(12).fill(1), JUNE)).toBe(10);
  });

  it("falls back to base days for a null / wrong-length array", () => {
    expect(adjustedFrequencyDays(10, null, JUNE)).toBe(10);
    expect(adjustedFrequencyDays(10, [1, 1, 1], JUNE)).toBe(10);
  });

  it("ignores a non-positive or non-finite multiplier", () => {
    const bad = Array(12).fill(1);
    bad[5] = 0;
    expect(adjustedFrequencyDays(10, bad, JUNE)).toBe(10);
    bad[5] = NaN;
    expect(adjustedFrequencyDays(10, bad, JUNE)).toBe(10);
  });
});
