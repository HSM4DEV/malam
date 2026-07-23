import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import {
  formatCompactCount,
  formatDelta,
  formatDuration,
  formatPercent,
  toArabicDigits,
} from "@/lib/format";
import { getDeveloperCompany } from "@/lib/data/company";
import type { BreakdownBar, DeveloperAnalyticsData } from "@/types/dashboard";

export const getDeveloperAnalytics = cache(
  async (): Promise<DeveloperAnalyticsData> => {
    const company = await getDeveloperCompany();
    const companyId = company.id;

    const [viewsAgg, summary, points, topProjects, leadsWithCity, trafficSources] =
      await Promise.all([
        prisma.project.aggregate({ where: { companyId }, _sum: { viewCount: true } }),
        prisma.analyticsSummary.findUnique({ where: { companyId } }),
        prisma.analyticsPoint.findMany({
          where: { companyId },
          orderBy: { bucket: "asc" },
        }),
        prisma.project.findMany({
          where: { companyId, viewCount: { gt: 0 } },
          orderBy: { viewCount: "desc" },
          take: 5,
          select: { name: true, viewCount: true },
        }),
        prisma.lead.findMany({
          where: { companyId, stage: { not: "LOST" } },
          select: { project: { select: { city: true } } },
        }),
        prisma.trafficSource.findMany({
          where: { companyId },
          orderBy: { sort: "asc" },
        }),
      ]);

    const totalViews = viewsAgg._sum.viewCount ?? 0;

    const kpis: DeveloperAnalyticsData["kpis"] = [
      { id: "views", label: "إجمالي المشاهدات", value: formatCompactCount(totalViews), delta: formatDelta(summary?.portfolioViewsDelta ?? 0), deltaDirection: (summary?.portfolioViewsDelta ?? 0) >= 0 ? "up" : "down", icon: "◔" },
      { id: "visitors", label: "زوّار فريدون", value: formatCompactCount(summary?.uniqueVisitors ?? 0), delta: formatDelta(summary?.uniqueVisitorsDelta ?? 0), deltaDirection: (summary?.uniqueVisitorsDelta ?? 0) >= 0 ? "up" : "down", icon: "☺" },
      { id: "engagement", label: "متوسط زمن التصفّح", value: formatDuration(summary?.avgSessionSeconds ?? 0), delta: formatDelta(summary?.avgSessionDelta ?? 0), deltaDirection: (summary?.avgSessionDelta ?? 0) >= 0 ? "up" : "down", icon: "◷" },
      { id: "conversion", label: "معدّل الطلبات", value: formatPercent(summary?.conversionRate ?? 0), delta: formatDelta(summary?.conversionRateDelta ?? 0), deltaDirection: (summary?.conversionRateDelta ?? 0) >= 0 ? "up" : "down", icon: "✉" },
    ];

    const chart: DeveloperAnalyticsData["chart"] = {
      weekly: points
        .filter((p) => p.period === "WEEKLY")
        .map((p) => ({ label: p.label, heightPct: p.value })),
      monthly: points
        .filter((p) => p.period === "MONTHLY")
        .map((p) => ({ label: p.label, heightPct: p.value })),
    };

    const maxProjectViews = topProjects[0]?.viewCount ?? 1;
    const viewsByProject: BreakdownBar[] = topProjects.map((project) => ({
      label: project.name,
      valueLabel: formatCompactCount(project.viewCount),
      pct: Math.round((project.viewCount / maxProjectViews) * 100),
    }));

    // Aggregate leads by their project's city.
    const cityCounts = new Map<string, number>();
    for (const lead of leadsWithCity) {
      const city = lead.project.city;
      cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
    }
    const sortedCities = [...cityCounts.entries()].sort((a, b) => b[1] - a[1]);
    const maxCity = sortedCities[0]?.[1] ?? 1;
    const leadsByCity: BreakdownBar[] = sortedCities.map(([city, count]) => ({
      label: city,
      valueLabel: `${toArabicDigits(count)} طلب`,
      pct: Math.round((count / maxCity) * 100),
    }));

    const totalVisits = trafficSources.reduce((sum, s) => sum + s.visits, 0) || 1;

    return {
      kpis,
      chart,
      viewsByProject,
      leadsByCity,
      trafficSources: trafficSources.map((source) => {
        const pct = Math.round((source.visits / totalVisits) * 100);
        return { label: source.label, valueLabel: formatPercent(pct), pct };
      }),
    };
  },
);
