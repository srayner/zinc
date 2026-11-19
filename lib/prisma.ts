import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  // Not checked here: `next build` imports this module with no DATABASE_URL set. When it is
  // missing at runtime, pg falls back to its defaults (localhost:5432) and the first query fails.
  const url = process.env.DATABASE_URL;

  // Prisma 7 connects through the pg driver, which ignores Prisma's own ?schema= URL
  // parameter, so pass it on as the adapter's option (pg's default is public).
  const schema = url ? (new URL(url).searchParams.get("schema") ?? undefined) : undefined;
  const adapter = new PrismaPg(
    // pg has no connect timeout by default; 5s matches what Prisma 6's own engine used.
    { connectionString: url, connectionTimeoutMillis: 5_000 },
    { schema },
  );
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
