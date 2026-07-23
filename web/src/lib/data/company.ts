import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { toArabicDigits } from "@/lib/format";
import { DEVELOPER_NAV } from "@/lib/data/mappers";
import type { DashboardNavItem, DeveloperAccount } from "@/types/dashboard";

/**
 * Resolves the developer company whose dashboard is being viewed.
 *
 * Phase 3 (auth wiring) will derive this from the NextAuth session
 * (`session.user.companyId`). Until real sign-in exists, the dashboard
 * operates on the seeded demo developer company. Wrapped in `cache()` so the
 * layout and page share a single lookup per request.
 */
export const getDeveloperCompany = cache(async () => {
  const company = await prisma.company.findUnique({
    where: { slug: "vision-group" },
    include: {
      members: { orderBy: { createdAt: "asc" }, take: 1 },
    },
  });

  if (!company) {
    throw new Error(
      "Demo developer company not found. Run `npm run db:seed` after migrating.",
    );
  }

  return company;
});

export async function getDeveloperCompanyId(): Promise<string> {
  const company = await getDeveloperCompany();
  return company.id;
}

/**
 * Lightweight data for the dashboard shell (sidebar + account), used by the
 * layout on every dashboard route. Avoids running the full Overview
 * aggregation just to render navigation.
 */
export const getDeveloperShell = cache(
  async (): Promise<{ account: DeveloperAccount; nav: DashboardNavItem[] }> => {
    const company = await getDeveloperCompany();
    const newLeads = await prisma.lead.count({
      where: { companyId: company.id, stage: "NEW" },
    });

    const nav: DashboardNavItem[] = DEVELOPER_NAV.map((item) =>
      item.key === "leads" && newLeads > 0
        ? { ...item, badge: toArabicDigits(Math.min(newLeads, 99)) }
        : { ...item },
    );

    return {
      account: {
        companyName: company.name,
        roleLabel: company.type === "DEVELOPER" ? "حساب مطوّر" : "حساب وسيط",
        avatarSeed: company.avatarSeed ?? "dd-user",
        avatarAlt: "صورة المطوّر",
      },
      nav,
    };
  },
);
