import { describe, expect, it } from "vitest";
import { effortLabel, zoneLabel, MONTH_LABELS } from "@/lib/taskTypes";

describe("taskType labels", () => {
  it("maps effort levels to display text", () => {
    expect(effortLabel("QUICK")).toBe("Quick");
    expect(effortLabel("MEDIUM")).toBe("Medium");
    expect(effortLabel("INVOLVED")).toBe("Involved");
  });

  it("maps zone types to display text", () => {
    expect(zoneLabel("HOUSE")).toBe("House");
    expect(zoneLabel("CARS")).toBe("Cars");
  });

  it("has twelve month labels", () => {
    expect(MONTH_LABELS).toHaveLength(12);
    expect(MONTH_LABELS[0]).toBe("Jan");
    expect(MONTH_LABELS[11]).toBe("Dec");
  });
});
