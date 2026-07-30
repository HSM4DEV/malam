import "server-only";
import { headers } from "next/headers";

/**
 * Best-effort client IP for rate limiting. Vercel's edge network sets
 * `x-forwarded-for` reliably on every request; `x-real-ip` is a fallback
 * for other environments. Falls back to a constant so a missing header
 * degrades to "everyone shares one bucket" rather than throwing.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return h.get("x-real-ip") ?? "unknown";
}
