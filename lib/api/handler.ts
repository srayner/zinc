import { NextRequest, NextResponse } from "next/server";
import { handleAppError } from "./error";

/**
 * Wraps a route handler: unwraps a `{ status, ...data }` return into a
 * JSON response with that status, plain returns into a 200, and routes any
 * thrown error through `handleAppError`.
 */
export function withErrorHandling<T, C>(
  handler: (req: NextRequest, context: C) => Promise<T>
) {
  return async function (req: NextRequest, context: C) {
    try {
      const result = await handler(req, context);

      if (result && typeof result === "object" && "status" in result) {
        const { status, ...data } = result as {
          status: number;
          [key: string]: unknown;
        };
        return NextResponse.json(data, { status });
      }

      return NextResponse.json(result);
    } catch (err) {
      return handleAppError(err);
    }
  };
}
