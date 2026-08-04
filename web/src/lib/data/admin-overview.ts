import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

export interface PlatformOverview {
  usersByRole: Partial<Record<"BUYER" | "DEVELOPER" | "BROKER" | "ADMIN", number>>;
  totalUsers: number;
  companiesByType: Partial<Record<"DEVELOPER" | "BROKER", number>>;
  totalCompanies: number;
  projectsByStatus: Partial<Record<"DRAFT" | "IN_REVIEW" | "PUBLISHED", number>>;
  totalProjects: number;
  leadsByStage: Partial<Record<"NEW" | "CONTACTED" | "VIEWING" | "NEGOTIATING" | "WON" | "LOST", number>>;
  totalLeads: number;
  subscriberCount: number;
  pendingApplicationsCount: number;
}

/** Platform-wide counts for the admin overview page — not company-scoped, unlike everything else in src/lib/data/. */
export const getPlatformOverview = cache(async (): Promise<PlatformOverview> => {
  const [usersByRole, companiesByType, projectsByStatus, leadsByStage, subscriberCount, pendingApplicationsCount] =
    await Promise.all([
      prisma.user.groupBy({ by: ["role"], _count: true }),
      prisma.company.groupBy({ by: ["type"], _count: true }),
      prisma.project.groupBy({ by: ["status"], _count: true }),
      prisma.lead.groupBy({ by: ["stage"], _count: true }),
      prisma.newsletterSubscriber.count(),
      prisma.inquiry.count({ where: { type: "DEVELOPER_APPLICATION", status: "NEW" } }),
    ]);

  const sumCounts = (rows: Array<{ _count: number }>) => rows.reduce((sum, r) => sum + r._count, 0);

  return {
    usersByRole: Object.fromEntries(usersByRole.map((r) => [r.role, r._count])),
    totalUsers: sumCounts(usersByRole),
    companiesByType: Object.fromEntries(companiesByType.map((r) => [r.type, r._count])),
    totalCompanies: sumCounts(companiesByType),
    projectsByStatus: Object.fromEntries(projectsByStatus.map((r) => [r.status, r._count])),
    totalProjects: sumCounts(projectsByStatus),
    leadsByStage: Object.fromEntries(leadsByStage.map((r) => [r.stage, r._count])),
    totalLeads: sumCounts(leadsByStage),
    subscriberCount,
    pendingApplicationsCount,
  };
});
