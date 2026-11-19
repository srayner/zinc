import { ZoneType } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export function listZones() {
  return prisma.zone.findMany({
    orderBy: { type: "asc" },
    include: {
      _count: {
        select: { areas: { where: { archivedAt: null } } },
      },
    },
  });
}

export function parseZoneType(value: string): ZoneType | null {
  const upper = value.toUpperCase();
  return (Object.values(ZoneType) as string[]).includes(upper)
    ? (upper as ZoneType)
    : null;
}

export function getZoneByType(type: ZoneType) {
  return prisma.zone.findUnique({
    where: { type },
    include: {
      areas: {
        where: { archivedAt: null },
        orderBy: { name: "asc" },
      },
    },
  });
}
