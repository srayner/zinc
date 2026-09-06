import { describe, expect, it } from "vitest";
import { prismaMock } from "../../test/mocks/prisma";
import { createArea, listAreas, updateArea } from "@/services/areas";
import { AppError } from "@/lib/api/error";

describe("listAreas", () => {
  it("excludes archived areas by default", async () => {
    prismaMock.area.findMany.mockResolvedValue([]);
    await listAreas({ zoneId: "z1" });
    expect(prismaMock.area.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { zoneId: "z1", archivedAt: null },
      })
    );
  });

  it("includes archived areas when asked", async () => {
    prismaMock.area.findMany.mockResolvedValue([]);
    await listAreas({ zoneId: "z1", includeArchived: true });
    expect(prismaMock.area.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { zoneId: "z1", archivedAt: undefined },
      })
    );
  });
});

describe("createArea", () => {
  it("throws a 404 AppError when the zone is missing", async () => {
    prismaMock.zone.findUnique.mockResolvedValue(null);
    await expect(createArea({ zoneId: "nope", name: "Loft" })).rejects.toThrow(
      AppError
    );
  });

  it("creates the area under an existing zone", async () => {
    // @ts-expect-error partial mock is enough for the test
    prismaMock.zone.findUnique.mockResolvedValue({ id: "z1" });
    // @ts-expect-error partial mock is enough for the test
    prismaMock.area.create.mockResolvedValue({ id: "a1", name: "Loft" });

    const area = await createArea({ zoneId: "z1", name: "Loft" });

    expect(area).toEqual({ id: "a1", name: "Loft" });
    expect(prismaMock.area.create).toHaveBeenCalledWith({
      data: { zoneId: "z1", name: "Loft" },
    });
  });
});

describe("updateArea", () => {
  it("sets archivedAt to a date when archiving", async () => {
    // @ts-expect-error partial mock is enough for the test
    prismaMock.area.update.mockResolvedValue({ id: "a1" });
    await updateArea("a1", { archived: true });
    const arg = prismaMock.area.update.mock.calls[0][0];
    expect(arg.where).toEqual({ id: "a1" });
    expect(arg.data.archivedAt).toBeInstanceOf(Date);
  });

  it("clears archivedAt when restoring", async () => {
    // @ts-expect-error partial mock is enough for the test
    prismaMock.area.update.mockResolvedValue({ id: "a1" });
    await updateArea("a1", { archived: false });
    expect(prismaMock.area.update.mock.calls[0][0].data.archivedAt).toBeNull();
  });
});
