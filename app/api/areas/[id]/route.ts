import type { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { withAuth } from "@/lib/api/with-auth";
import { AppError } from "@/lib/api/error";
import { UpdateAreaSchema } from "@/schemas";
import { archiveArea, updateArea } from "@/services/areas";

type Context = { params: Promise<{ id: string }> };

export const PATCH = withErrorHandling(
  withAuth(async (req: NextRequest, { params }: Context) => {
    const { id } = await params;
    const parsed = UpdateAreaSchema.safeParse(await req.json());
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const area = await updateArea(id, parsed.data);
    return { area };
  })
);

export const DELETE = withErrorHandling(
  withAuth(async (_req: NextRequest, { params }: Context) => {
    const { id } = await params;
    const area = await archiveArea(id);
    return { area };
  })
);
