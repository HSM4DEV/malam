import "server-only";

import { prisma } from "@/lib/prisma";

export const RATE_LIMIT_MESSAGE = "لقد تجاوزت الحد المسموح من المحاولات، يرجى المحاولة لاحقاً.";

const PRUNE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
// Only prune on a small fraction of calls — cheap way to keep the table
// bounded without a cron job or a write on every single check.
const PRUNE_PROBABILITY = 0.01;

interface RateLimitOptions {
  /** Identifies what's being limited, e.g. "login:email:x@y.com". */
  key: string;
  /** Max hits allowed within the window. */
  limit: number;
  windowMs: number;
}

/**
 * Postgres-backed rate limiter — no Redis/KV in this stack, and an
 * in-memory counter wouldn't work reliably across Vercel's stateless
 * serverless instances. Counts recent hits for `key`; if under `limit`,
 * records this attempt and allows it.
 *
 * Count-then-insert isn't atomic, so concurrent requests at the exact
 * threshold could slip through by one or two — an accepted tradeoff for
 * these low-traffic forms, not worth a more complex atomic scheme.
 */
export async function checkRateLimit({ key, limit, windowMs }: RateLimitOptions): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMs);

  const count = await prisma.rateLimitHit.count({
    where: { key, createdAt: { gte: windowStart } },
  });

  if (count >= limit) {
    return false;
  }

  await prisma.rateLimitHit.create({ data: { key } });

  if (Math.random() < PRUNE_PROBABILITY) {
    await prisma.rateLimitHit.deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - PRUNE_MAX_AGE_MS) } },
    });
  }

  return true;
}
