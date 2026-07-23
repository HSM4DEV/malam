import "server-only";

import { prisma } from "@/lib/prisma";

export async function isResetTokenValid(token: string): Promise<boolean> {
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  return Boolean(record) && record!.expires > new Date();
}
