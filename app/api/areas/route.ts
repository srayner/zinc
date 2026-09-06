import type { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { withAuth } from "@/lib/api/with-auth";
import { AppError } from "@/lib/api/error";
import { CreateAreaSchema } from "@/schemas";
import { createArea, listAreas } from "@/services/areas";

export const GET = withErrorHandling(
  withAuth(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const areas = await listAreas({
      zoneId: searchParams.get("zoneId") ?? undefined,
      includeArchived: searchParams.get("includeArchived") === "true",
    });
    return { areas };
  })
);

export const POST = withErrorHandling(
  withAuth(async (req: NextRequest) => {
    const parsed = CreateAreaSchema.safeParse(await req.json());
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const area = await createArea(parsed.data);
    return { area, status: 201 };
  })
);
