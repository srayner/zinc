import { describe, expect, it } from "vitest";
import { prismaMock } from "../../test/mocks/prisma";
import { createTaskType, deleteTaskType } from "@/services/taskTypes";
import { AppError } from "@/lib/api/error";

const input = {
  name: "Cut grass",
  defaultFrequencyDays: 14,
  defaultWeight: 1,
  effortLevel: "MEDIUM" as const,
  applicableZoneTypes: ["GARDEN" as const],
  seasonalMultipliers: [3, 3, 1.5, 1, 0.6, 0.5, 0.5, 0.6, 0.9, 1.5, 2.5, 3],
};

describe("createTaskType", () => {
  it("passes the seasonal multipliers straight through to prisma", async () => {
    // @ts-expect-error partial mock is enough
    prismaMock.taskType.create.mockResolvedValue({ id: "t1", ...input });

    await createTaskType(input);

    expect(prismaMock.taskType.create).toHaveBeenCalledWith({ data: input });
  });
});

describe("deleteTaskType", () => {
  it("throws a 409 AppError when the task type is assigned to an area", async () => {
    prismaMock.areaTask.count.mockResolvedValue(2);

    await expect(deleteTaskType("t1")).rejects.toMatchObject({
      status: 409,
    });
    await expect(deleteTaskType("t1")).rejects.toBeInstanceOf(AppError);
    expect(prismaMock.taskType.delete).not.toHaveBeenCalled();
  });

  it("deletes when nothing references it", async () => {
    prismaMock.areaTask.count.mockResolvedValue(0);
    // @ts-expect-error partial mock is enough
    prismaMock.taskType.delete.mockResolvedValue({ id: "t1" });

    await deleteTaskType("t1");

    expect(prismaMock.taskType.delete).toHaveBeenCalledWith({
      where: { id: "t1" },
    });
  });
});
