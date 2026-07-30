import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import {
  formatCompactCount,
  formatDelta,
  formatMillions,
  formatRelativeArabic,
  initialOf,
  toArabicDigits,
  toneFromString,
} from "@/lib/format";
import { getDeveloperCompany } from "@/lib/data/company";
import { DEVELOPER_NAV, projectStatusToUi } from "@/lib/data/mappers";
import type { CompanyType } from "@/generated/prisma/enums";
import type {
  DashboardNavItem,
  DeveloperOverviewData,
} from "@/types/dashboard";

const DAY_MS = 86400000;

function roleLabel(type: CompanyType): string {
  return type === "DEVELOPER" ? "حساب مطوّر" : "حساب وسيط";
}

/**
 * Developer Dashboard — Overview. Aggregates live data for the KPI row,
 * views chart, latest leads, and the projects table.
 */
export const getDeveloperOverview = cache(
  async (): Promise<DeveloperOverviewData> => {
    const company = await getDeveloperCompany();
    const companyId = company.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * DAY_MS);

    const [
      aggregates,
      newLeadsCount,
      summary,
      points,
      recentLeads,
      recentProjects,
    ] = await Promise.all([
      prisma.project.aggregate({
        where: { companyId },
        _sum: { viewCount: true, soldUnits: true },
      }),
      prisma.lead.count({
        where: { companyId, createdAt: { gte: thirtyDaysAgo }, stage: { not: "LOST" } },
      }),
      prisma.analyticsSummary.findUnique({ where: { companyId } }),
      prisma.analyticsPoint.findMany({
        where: { companyId },
        orderBy: { bucket: "asc" },
      }),
      prisma.lead.findMany({
        where: { companyId, stage: { not: "LOST" } },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { project: { select: { name: true } } },
      }),
      prisma.project.findMany({
        where: { companyId },
        orderBy: { createdAt: "asc" },
        take: 5,
      }),
    ]);

    const nav: DashboardNavItem[] = DEVELOPER_NAV.map((item) =>
      item.key === "leads"
        ? { ...item, badge: toArabicDigits(newLeadsCount > 99 ? 99 : newLeadsCount) }
        : { ...item },
    );

    const kpis: DeveloperOverviewData["kpis"] = [
      {
        id: "portfolio-views",
        label: "مشاهدات المحفظة",
        value: formatCompactCount(aggregates._sum.viewCount ?? 0),
        delta: `${formatDelta(summary?.portfolioViewsDelta ?? 0)} عن الشهر الماضي`,
        deltaDirection: (summary?.portfolioViewsDelta ?? 0) >= 0 ? "up" : "down",
        icon: "◔",
      },
      {
        id: "new-leads",
        label: "طلبات جديدة",
        value: toArabicDigits(newLeadsCount),
        delta: `${formatDelta(summary?.newLeadsDelta ?? 0)} عن الشهر الماضي`,
        deltaDirection: (summary?.newLeadsDelta ?? 0) >= 0 ? "up" : "down",
        icon: "✉",
      },
      {
        id: "units-sold",
        label: "وحدات مباعة",
        value: toArabicDigits(aggregates._sum.soldUnits ?? 0),
        delta: `${formatDelta(summary?.unitsSoldDelta ?? 0)} عن الشهر الماضي`,
        deltaDirection: (summary?.unitsSoldDelta ?? 0) >= 0 ? "up" : "down",
        icon: "✓",
      },
      {
        id: "monthly-revenue",
        label: "إيراد الشهر (بالمليون)",
        value: formatMillions(summary?.monthlyRevenueMillions ?? 0),
        delta: `${formatDelta(summary?.monthlyRevenueDelta ?? 0)} عن الشهر الماضي`,
        deltaDirection: (summary?.monthlyRevenueDelta ?? 0) >= 0 ? "up" : "down",
        icon: "◈",
      },
    ];

    const chart: DeveloperOverviewData["chart"] = {
      weekly: points
        .filter((p) => p.period === "WEEKLY")
        .map((p) => ({ label: p.label, heightPct: p.value })),
      monthly: points
        .filter((p) => p.period === "MONTHLY")
        .map((p) => ({ label: p.label, heightPct: p.value })),
    };

    const leads = recentLeads.map((lead) => ({
      id: lead.id,
      name: lead.buyerName,
      project: lead.unitLabel
        ? `${lead.project.name} · ${lead.unitLabel}`
        : lead.project.name,
      time: formatRelativeArabic(lead.createdAt),
      initials: initialOf(lead.buyerName),
      tone: toneFromString(lead.buyerName),
    }));

    const projects = recentProjects.map((project) => ({
      id: project.id,
      name: project.name,
      city: project.city,
      status: projectStatusToUi(project.status),
      soldUnits: project.soldUnits,
      totalUnits: project.totalUnits,
      viewsLabel: formatCompactCount(project.viewCount),
      imageSeed: project.imageSeed,
      imageAlt: project.imageAlt,
      imageUrl: project.imageUrl,
    }));

    return {
      account: {
        companyName: company.name,
        roleLabel: roleLabel(company.type),
        avatarSeed: company.avatarSeed ?? "dd-user",
        avatarAlt: "صورة المطوّر",
      },
      nav,
      kpis,
      chart,
      leads,
      filterTabs: [
        { key: "all", label: "الكل" },
        { key: "published", label: "منشور" },
        { key: "draft", label: "مسوّدة" },
      ],
      projects,
    };
  },
);
