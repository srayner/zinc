import type { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { withAuth } from "@/lib/api/with-auth";
import { AppError } from "@/lib/api/error";
import { UpdateTaskTypeSchema } from "@/schemas";
import { deleteTaskType, updateTaskType } from "@/services/taskTypes";

type Context = { params: Promise<{ id: string }> };

export const PATCH = withErrorHandling(
  withAuth(async (req: NextRequest, { params }: Context) => {
    const { id } = await params;
    const parsed = UpdateTaskTypeSchema.safeParse(await req.json());
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const taskType = await updateTaskType(id, parsed.data);
    return { taskType };
  })
);

export const DELETE = withErrorHandling(
  withAuth(async (_req: NextRequest, { params }: Context) => {
    const { id } = await params;
    await deleteTaskType(id);
    return { ok: true };
  })
);
