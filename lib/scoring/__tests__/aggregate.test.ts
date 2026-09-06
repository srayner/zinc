import { describe, expect, it } from "vitest";
import { rollUp } from "@/lib/scoring/aggregate";
import { scoreBand } from "@/lib/scoring/colour";

describe("rollUp", () => {
  it("averages the present scores", () => {
    expect(rollUp([8, 6, 4])).toBe(6);
  });

  it("ignores nulls", () => {
    expect(rollUp([8, null, 4])).toBe(6);
  });

  it("returns null when everything is unscored", () => {
    expect(rollUp([null, null])).toBeNull();
    expect(rollUp([])).toBeNull();
  });
});

describe("scoreBand", () => {
  it("maps the full range honestly", () => {
    expect(scoreBand(null)).toBe("unscored");
    expect(scoreBand(2)).toBe("critical");
    expect(scoreBand(4)).toBe("poor");
    expect(scoreBand(6)).toBe("fair");
    expect(scoreBand(8)).toBe("good");
    expect(scoreBand(10)).toBe("excellent");
  });
});
