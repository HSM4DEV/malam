import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Standard Next.js dev-mode singleton so hot reload doesn't exhaust connections.
// https://pris.ly/d/help/next-js-best-practices
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Falls back to an unreachable placeholder so the module can be imported safely
// (e.g. by the build, or by NextAuth's adapter wiring) before a real database
// is provisioned. The placeholder only surfaces as an error if a query actually
// runs — which doesn't happen yet, since every consumer is still mock-data-backed.
const PLACEHOLDER_CONNECTION_STRING =
  "postgresql://user:password@localhost:5432/malam?schema=public";

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn(
      "[prisma] DATABASE_URL is not set — using a placeholder connection string. " +
        "Queries will fail until `web/.env` points at a real database.",
    );
  }
  const adapter = new PrismaPg({
    connectionString: connectionString ?? PLACEHOLDER_CONNECTION_STRING,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
