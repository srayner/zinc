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
