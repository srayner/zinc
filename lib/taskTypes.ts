import { EffortLevel, ZoneType } from "@prisma/client";

export const EFFORT_LABELS: Record<EffortLevel, string> = {
  QUICK: "Quick",
  MEDIUM: "Medium",
  INVOLVED: "Involved",
};

export function effortLabel(effort: EffortLevel): string {
  return EFFORT_LABELS[effort];
}

export const ZONE_LABELS: Record<ZoneType, string> = {
  HOUSE: "House",
  GARDEN: "Garden",
  GARAGE: "Garage",
  CARS: "Cars",
};

export function zoneLabel(zone: ZoneType): string {
  return ZONE_LABELS[zone];
}

export const EFFORT_LEVELS = Object.keys(EFFORT_LABELS) as EffortLevel[];
export const ZONE_TYPES = Object.keys(ZONE_LABELS) as ZoneType[];

export const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
