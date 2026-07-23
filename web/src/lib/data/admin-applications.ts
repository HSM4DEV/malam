import "server-only";
import { randomBytes } from "node:crypto";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { Inquiry } from "@/generated/prisma/client";

/**
 * Pending + recently-reviewed developer/broker applications, for the admin
 * review page. Reviewed ones stay visible briefly so an admin can see the
 * outcome of their last few decisions, not just the queue.
 */
export const getApplications = cache(async (): Promise<Inquiry[]> => {
  return prisma.inquiry.findMany({
    where: { type: "DEVELOPER_APPLICATION" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
});

/**
 * A URL-safe, unique Company.slug from an applicant's company name. Arabic
 * names (the common case here) transliterate to nothing, so those — and any
 * collision with an existing slug — fall back to a random short slug rather
 * than looping through numbered suffixes forever.
 */
export async function uniqueCompanySlug(companyName: string): Promise<string> {
  const base = slugify(companyName);
  if (base) {
    const existing = await prisma.company.findUnique({ where: { slug: base } });
    if (!existing) return base;
  }
  return `company-${randomBytes(4).toString("hex")}`;
}
