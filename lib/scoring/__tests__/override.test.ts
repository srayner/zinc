import { describe, expect, it } from "vitest";
import { currentAreaScore, decayedOverrideScore } from "@/lib/scoring/override";

describe("decayedOverrideScore", () => {
  it("returns the stated value when freshly set", () => {
    expect(decayedOverrideScore(8, 0, 30)).toBe(8);
  });

  it("decays toward the age/frequency ratio", () => {
    expect(decayedOverrideScore(8, 15, 30)).toBe(4);
  });

  it("clamps to 1 once fully decayed", () => {
    expect(decayedOverrideScore(8, 60, 30)).toBe(1);
  });

  it("guards a non-positive decay period", () => {
    expect(decayedOverrideScore(6, 10, 0)).toBe(6);
  });
});

describe("currentAreaScore", () => {
  it("uses the decayed override while it is authoritative", () => {
    expect(
      currentAreaScore({
        computed: 9,
        override: {
          score: 8,
          ageDays: 15,
          areaMeanAdjustedFreqDays: 30,
          supersededByLog: false,
        },
      })
    ).toEqual({ value: 4, source: "override" });
  });

  it("falls back to the computed score once a log supersedes the override", () => {
    expect(
      currentAreaScore({
        computed: 9,
        override: {
          score: 2,
          ageDays: 1,
          areaMeanAdjustedFreqDays: 30,
          supersededByLog: true,
        },
      })
    ).toEqual({ value: 9, source: "computed" });
  });

  it("reports 'none' when there is no computed score and no override", () => {
    expect(currentAreaScore({ computed: null })).toEqual({
      value: null,
      source: "none",
    });
  });
});
