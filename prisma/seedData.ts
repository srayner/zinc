import { EffortLevel, ZoneType } from "@prisma/client";

export const NEUTRAL_12 = Array(12).fill(1);

export const zones: { name: string; type: ZoneType }[] = [
  { name: "House", type: ZoneType.HOUSE },
  { name: "Garden", type: ZoneType.GARDEN },
  { name: "Garage", type: ZoneType.GARAGE },
  { name: "Cars", type: ZoneType.CARS },
];

/**
 * Minimal placeholder task types so the UI has something to exercise in dev.
 * Real task types are entered by the user after setup.
 */
export const taskTypes: {
  name: string;
  defaultFrequencyDays: number;
  seasonalMultipliers: number[];
  effortLevel: EffortLevel;
  defaultWeight: number;
  applicableZoneTypes: ZoneType[];
}[] = [
  {
    name: "Vacuum",
    defaultFrequencyDays: 7,
    seasonalMultipliers: NEUTRAL_12,
    effortLevel: EffortLevel.QUICK,
    defaultWeight: 1,
    applicableZoneTypes: [ZoneType.HOUSE],
  },
  {
    name: "Clean bathroom",
    defaultFrequencyDays: 7,
    seasonalMultipliers: NEUTRAL_12,
    effortLevel: EffortLevel.MEDIUM,
    defaultWeight: 1.5,
    applicableZoneTypes: [ZoneType.HOUSE],
  },
  {
    name: "Cut grass",
    // Much more often in summer, barely at all in winter.
    defaultFrequencyDays: 14,
    seasonalMultipliers: [3, 3, 1.5, 1, 0.6, 0.5, 0.5, 0.6, 0.9, 1.5, 2.5, 3],
    effortLevel: EffortLevel.MEDIUM,
    defaultWeight: 1,
    applicableZoneTypes: [ZoneType.GARDEN],
  },
  {
    name: "Weed borders",
    defaultFrequencyDays: 21,
    seasonalMultipliers: [2, 2, 1.2, 0.8, 0.6, 0.6, 0.7, 0.8, 1, 1.4, 2, 2],
    effortLevel: EffortLevel.INVOLVED,
    defaultWeight: 0.8,
    applicableZoneTypes: [ZoneType.GARDEN],
  },
  {
    name: "Declutter / tidy",
    defaultFrequencyDays: 30,
    seasonalMultipliers: NEUTRAL_12,
    effortLevel: EffortLevel.INVOLVED,
    defaultWeight: 0.7,
    applicableZoneTypes: [ZoneType.GARAGE, ZoneType.HOUSE],
  },
  {
    name: "Wash car exterior",
    defaultFrequencyDays: 21,
    seasonalMultipliers: NEUTRAL_12,
    effortLevel: EffortLevel.MEDIUM,
    defaultWeight: 1,
    applicableZoneTypes: [ZoneType.CARS],
  },
  {
    name: "Clean car interior",
    defaultFrequencyDays: 30,
    seasonalMultipliers: NEUTRAL_12,
    effortLevel: EffortLevel.MEDIUM,
    defaultWeight: 1,
    applicableZoneTypes: [ZoneType.CARS],
  },
];

/** A couple of placeholder areas per zone. */
export const areasByZone: Record<string, string[]> = {
  HOUSE: ["Living room", "Main bathroom"],
  GARDEN: ["Front lawn", "Back borders"],
  GARAGE: ["Garage"],
  CARS: ["Estate", "Hatchback"],
};
