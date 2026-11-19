import type { NextAuthConfig } from "next-auth";

/**
 * The part of the auth setup the middleware uses: it only reads the session token, so this
 * file must not import anything that reaches the database (Prisma needs Node APIs).
 * Providers, the adapter and the database-backed callbacks live in lib/auth/index.ts.
 */
export default {
  providers: [],
  session: { strategy: "jwt" },
  trustHost: true,
} satisfies NextAuthConfig;
