import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

const isDev = process.env.NODE_ENV === "development";

export class AppError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export const handleAppError = (err: unknown) => {
  if (err instanceof AppError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "That already exists" },
        { status: 409 }
      );
    }
    if (err.code === "P2003") {
      return NextResponse.json(
        { error: "Foreign key constraint failed" },
        { status: 400 }
      );
    }
  }

  console.error("Unexpected error:", err);

  return NextResponse.json(
    {
      error:
        isDev && err instanceof Error ? err.message : "Internal Server Error",
    },
    { status: 500 }
  );
};
