import { prisma } from "@/lib/prisma";

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function getUserById(id: string | undefined) {
  if (!id) return null;
  return prisma.user.findUnique({ where: { id } });
}
