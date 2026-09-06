import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/api/error";
import type { CreateAreaInput, UpdateAreaInput } from "@/schemas";

export function listAreas(opts: { zoneId?: string; includeArchived?: boolean } = {}) {
  return prisma.area.findMany({
    where: {
      zoneId: opts.zoneId,
      archivedAt: opts.includeArchived ? undefined : null,
    },
    orderBy: { name: "asc" },
  });
}

export async function createArea(input: CreateAreaInput) {
  const zone = await prisma.zone.findUnique({ where: { id: input.zoneId } });
  if (!zone) throw new AppError("Zone not found", 404);

  return prisma.area.create({
    data: { zoneId: input.zoneId, name: input.name },
  });
}

export async function updateArea(id: string, input: UpdateAreaInput) {
  const data: { name?: string; archivedAt?: Date | null } = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.archived !== undefined) {
    data.archivedAt = input.archived ? new Date() : null;
  }

  return prisma.area.update({ where: { id }, data });
}

export function archiveArea(id: string) {
  return prisma.area.update({ where: { id }, data: { archivedAt: new Date() } });
}
