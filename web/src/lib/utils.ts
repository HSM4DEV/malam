import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * URL-safe slug from a name. Arabic (and other non-Latin) names collapse to
 * nothing under this transliteration-free approach, so callers should treat
 * an empty result as "generate a random slug instead" — see
 * `uniqueCompanySlug` in lib/data/admin-applications.ts for that fallback.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
