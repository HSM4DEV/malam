import "server-only";
import { cache } from "react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toArabicDigits } from "@/lib/format";
import { BROKER_NAV, DEVELOPER_NAV } from "@/lib/data/mappers";
import type { DashboardNavItem, DeveloperAccount } from "@/types/dashboard";

/**
 * Resolves the company whose dashboard is being viewed, from the signed-in
 * user's session (`session.user.companyId`). `src/proxy.ts` already gates
 * every /dashboard/* route to sessions with a role of DEVELOPER/BROKER and a
 * companyId set, so the errors below are defensive invariants, not expected
 * user-facing paths. Wrapped in `cache()` so the layout and page share a
 * single lookup per request.
 */
export const getDeveloperCompany = cache(async () => {
  const session = await auth();
  const companyId = session?.user?.companyId;
  if (!companyId) {
    throw new Error("No company is associated with the current session.");
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      members: { orderBy: { createdAt: "asc" }, take: 1 },
    },
  });

  if (!company) {
    throw new Error(`Company ${companyId} referenced by the session was not found.`);
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

/**
 * Lightweight data for the broker dashboard shell (sidebar + account), used
 * by the broker layout on every /dashboard/broker/* route. Mirrors
 * getDeveloperShell() above, keyed off BROKER_NAV instead.
 */
export const getBrokerShell = cache(
  async (): Promise<{ account: DeveloperAccount; nav: DashboardNavItem[] }> => {
    const company = await getDeveloperCompany();
    const newLeads = await prisma.lead.count({
      where: { companyId: company.id, stage: "NEW" },
    });

    const nav: DashboardNavItem[] = BROKER_NAV.map((item) =>
      item.key === "clients" && newLeads > 0
        ? { ...item, badge: toArabicDigits(Math.min(newLeads, 99)) }
        : { ...item },
    );

    return {
      account: {
        companyName: company.name,
        roleLabel: "حساب وسيط",
        avatarSeed: company.avatarSeed ?? "bd-user",
        avatarAlt: "صورة الوسيط",
      },
      nav,
    };
  },
);
