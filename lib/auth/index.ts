import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@/lib/generated/prisma/enums";

import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/services/user";
import authConfig from "@/lib/auth/config";

/** Full auth setup: the middleware's config plus everything that needs the database. */
export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
});
