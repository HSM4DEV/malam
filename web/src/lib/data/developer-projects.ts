import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { formatCompactCount, formatDelta, formatMillions, toArabicDigits } from "@/lib/format";
import { getDeveloperCompany } from "@/lib/data/company";
import { projectStatusToUi } from "@/lib/data/mappers";
import type { DeveloperProjectsData } from "@/types/dashboard";

export const getDeveloperProjects = cache(
  async (): Promise<DeveloperProjectsData> => {
    const company = await getDeveloperCompany();
    const companyId = company.id;

    const [totalProjects, publishedProjects, aggregates, totalLeads, summary, projects] =
      await Promise.all([
        prisma.project.count({ where: { companyId } }),
        prisma.project.count({ where: { companyId, status: "PUBLISHED" } }),
        prisma.project.aggregate({ where: { companyId }, _sum: { soldUnits: true } }),
        prisma.lead.count({ where: { companyId, stage: { not: "LOST" } } }),
        prisma.analyticsSummary.findUnique({ where: { companyId } }),
        prisma.project.findMany({
          where: { companyId },
          orderBy: { createdAt: "asc" },
          include: {
            _count: { select: { leads: { where: { stage: { not: "LOST" } } } } },
          },
        }),
      ]);

    const stats: DeveloperProjectsData["stats"] = [
      { id: "total", label: "إجمالي المشاريع", value: toArabicDigits(totalProjects), delta: "المحفظة الكاملة", deltaDirection: "up", icon: "▤" },
      { id: "published", label: "منشورة", value: toArabicDigits(publishedProjects), delta: "نشطة الآن", deltaDirection: "up", icon: "✓" },
      { id: "units", label: "وحدات مباعة", value: toArabicDigits(aggregates._sum.soldUnits ?? 0), delta: `${formatDelta(summary?.unitsSoldDelta ?? 0)} عن الشهر الماضي`, deltaDirection: (summary?.unitsSoldDelta ?? 0) >= 0 ? "up" : "down", icon: "▦" },
      { id: "leads", label: "طلبات مرتبطة", value: toArabicDigits(totalLeads), delta: `${formatDelta(summary?.newLeadsDelta ?? 0)} عن الشهر الماضي`, deltaDirection: (summary?.newLeadsDelta ?? 0) >= 0 ? "up" : "down", icon: "✉" },
    ];

    return {
      stats,
      filterTabs: [
        { key: "all", label: "الكل" },
        { key: "published", label: "منشور" },
        { key: "review", label: "قيد المراجعة" },
        { key: "draft", label: "مسوّدة" },
      ],
      projects: projects.map((project) => ({
        id: project.id,
        name: project.name,
        cityLabel: `${project.city} · ${project.district}`,
        status: projectStatusToUi(project.status),
        type: project.type,
        priceLabel: formatMillions(project.priceFromMillions),
        soldUnits: project.soldUnits,
        totalUnits: project.totalUnits,
        viewsLabel: formatCompactCount(project.viewCount),
        leadsCount: project._count.leads,
        imageSeed: project.imageSeed,
        imageAlt: project.imageAlt,
        tag: project.tag,
      })),
    };
  },
);
