import type { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { withAuth } from "@/lib/api/with-auth";
import { AppError } from "@/lib/api/error";
import { CreateTaskTypeSchema } from "@/schemas";
import { createTaskType, listTaskTypes } from "@/services/taskTypes";

export const GET = withErrorHandling(
  withAuth(async () => {
    const taskTypes = await listTaskTypes();
    return { taskTypes };
  })
);

export const POST = withErrorHandling(
  withAuth(async (req: NextRequest) => {
    const parsed = CreateTaskTypeSchema.safeParse(await req.json());
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const taskType = await createTaskType(parsed.data);
    return { taskType, status: 201 };
  })
);
