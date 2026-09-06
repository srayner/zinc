import { describe, expect, it } from "vitest";
import { overdueRatio, subScore } from "@/lib/scoring/subScore";

describe("overdueRatio", () => {
  it("is 0 when just done and 1 when exactly due", () => {
    expect(overdueRatio(0, 10)).toBe(0);
    expect(overdueRatio(10, 10)).toBe(1);
  });

  it("exceeds 1 when overdue", () => {
    expect(overdueRatio(20, 10)).toBe(2);
  });

  it("guards a non-positive frequency", () => {
    expect(overdueRatio(5, 0)).toBe(0);
  });

  it("treats negative elapsed time as 0", () => {
    expect(overdueRatio(-5, 10)).toBe(0);
  });
});

describe("subScore", () => {
  it("is 10 when just done", () => {
    expect(subScore(0, 10)).toBe(10);
  });

  it("is 5 at half the interval", () => {
    expect(subScore(5, 10)).toBe(5);
  });

  it("is 7.5 at a quarter of the interval", () => {
    expect(subScore(2.5, 10)).toBe(7.5);
  });

  it("clamps to 1 when exactly due or beyond", () => {
    expect(subScore(10, 10)).toBe(1);
    expect(subScore(100, 10)).toBe(1);
  });

  it("never exceeds 10", () => {
    expect(subScore(-100, 10)).toBe(10);
  });
});
