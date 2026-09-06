import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/api/error";
import type { CreateTaskTypeInput, UpdateTaskTypeInput } from "@/schemas";

export function listTaskTypes() {
  return prisma.taskType.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { areaTasks: true } } },
  });
}

export function getTaskType(id: string) {
  return prisma.taskType.findUnique({
    where: { id },
    include: { _count: { select: { areaTasks: true } } },
  });
}

export function createTaskType(input: CreateTaskTypeInput) {
  return prisma.taskType.create({ data: input });
}

export async function updateTaskType(id: string, input: UpdateTaskTypeInput) {
  return prisma.taskType.update({ where: { id }, data: input });
}

export async function deleteTaskType(id: string) {
  const inUse = await prisma.areaTask.count({ where: { taskTypeId: id } });
  if (inUse > 0) {
    throw new AppError("In use by one or more areas", 409);
  }
  return prisma.taskType.delete({ where: { id } });
}
