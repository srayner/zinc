import { describe, expect, it } from "vitest";
import { CreateTaskTypeSchema } from "@/schemas";

const valid = {
  name: "Gutter clear",
  defaultFrequencyDays: 180,
  defaultWeight: 1,
  effortLevel: "INVOLVED",
  applicableZoneTypes: ["HOUSE", "GARDEN"],
  seasonalMultipliers: Array(12).fill(1),
};

describe("CreateTaskTypeSchema", () => {
  it("accepts a valid payload", () => {
    expect(CreateTaskTypeSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a multiplier array that is not length 12", () => {
    expect(
      CreateTaskTypeSchema.safeParse({
        ...valid,
        seasonalMultipliers: Array(11).fill(1),
      }).success
    ).toBe(false);
    expect(
      CreateTaskTypeSchema.safeParse({
        ...valid,
        seasonalMultipliers: Array(13).fill(1),
      }).success
    ).toBe(false);
  });

  it("rejects a zero or negative multiplier", () => {
    const bad = Array(12).fill(1);
    bad[5] = 0;
    expect(
      CreateTaskTypeSchema.safeParse({ ...valid, seasonalMultipliers: bad }).success
    ).toBe(false);
  });

  it("rejects empty applicableZoneTypes", () => {
    expect(
      CreateTaskTypeSchema.safeParse({ ...valid, applicableZoneTypes: [] }).success
    ).toBe(false);
  });

  it("rejects a non-integer frequency", () => {
    expect(
      CreateTaskTypeSchema.safeParse({ ...valid, defaultFrequencyDays: 7.5 }).success
    ).toBe(false);
  });

  it("rejects an unknown effort level", () => {
    expect(
      CreateTaskTypeSchema.safeParse({ ...valid, effortLevel: "EPIC" }).success
    ).toBe(false);
  });
});

// The custom messages the task-type form shows. An empty number input reaches
// the schema as NaN (react-hook-form valueAsNumber), so NaN stands for "blank".
describe("CreateTaskTypeSchema messages", () => {
  it.each([
    ["blank name", { name: "   " }, "Name is required"],
    ["blank frequency", { defaultFrequencyDays: NaN }, "Frequency is required"],
    ["fractional frequency", { defaultFrequencyDays: 7.5 }, "Frequency must be a whole number of days"],
    ["zero frequency", { defaultFrequencyDays: 0 }, "Frequency must be at least 1 day"],
    ["blank weight", { defaultWeight: NaN }, "Weight is required"],
    ["zero weight", { defaultWeight: 0 }, "Weight must be greater than 0"],
    ["no zones", { applicableZoneTypes: [] }, "Pick at least one zone"],
    ["11 multipliers", { seasonalMultipliers: Array(11).fill(1) }, "Provide exactly 12 monthly multipliers"],
  ])("%s gives its message", (_label, override, message) => {
    const result = CreateTaskTypeSchema.safeParse({ ...valid, ...override });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.message)).toEqual([message]);
  });
});
