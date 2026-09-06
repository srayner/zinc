import { describe, expect, it } from "vitest";
import { computedAreaScore } from "@/lib/scoring/areaScore";

describe("computedAreaScore", () => {
  it("returns null when there are no inputs", () => {
    expect(computedAreaScore([])).toBeNull();
  });

  it("returns null when every task is on hold", () => {
    expect(
      computedAreaScore([
        { subScore: 8, weight: 1, onHold: true },
        { subScore: 2, weight: 1, onHold: true },
      ])
    ).toBeNull();
  });

  it("returns null when all weights are non-positive", () => {
    expect(
      computedAreaScore([{ subScore: 8, weight: 0, onHold: false }])
    ).toBeNull();
  });

  it("is the plain mean with equal weights", () => {
    expect(
      computedAreaScore([
        { subScore: 10, weight: 1, onHold: false },
        { subScore: 4, weight: 1, onHold: false },
      ])
    ).toBe(7);
  });

  it("respects weighting", () => {
    expect(
      computedAreaScore([
        { subScore: 10, weight: 3, onHold: false },
        { subScore: 2, weight: 1, onHold: false },
      ])
    ).toBe(8);
  });

  it("excludes on-hold tasks from the average", () => {
    expect(
      computedAreaScore([
        { subScore: 10, weight: 1, onHold: false },
        { subScore: 1, weight: 1, onHold: true },
      ])
    ).toBe(10);
  });
});
