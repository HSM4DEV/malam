import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import {
  formatDelta,
  formatPercent,
  formatPhone,
  formatRelativeArabic,
  initialOf,
  toArabicDigits,
  toneFromString,
} from "@/lib/format";
import { getDeveloperCompany } from "@/lib/data/company";
import { leadSourceToAr, leadStageToUi } from "@/lib/data/mappers";
import type { DeveloperLeadsData } from "@/types/dashboard";

export const getDeveloperLeads = cache(async (): Promise<DeveloperLeadsData> => {
  const company = await getDeveloperCompany();
  const companyId = company.id;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [newCount, newTodayCount, activeCount, viewingCount, summary, leads] =
    await Promise.all([
      prisma.lead.count({ where: { companyId, stage: "NEW" } }),
      prisma.lead.count({
        where: { companyId, stage: "NEW", createdAt: { gte: startOfToday } },
      }),
      prisma.lead.count({
        where: { companyId, stage: { in: ["CONTACTED", "VIEWING", "NEGOTIATING"] } },
      }),
      prisma.lead.count({ where: { companyId, stage: "VIEWING" } }),
      prisma.analyticsSummary.findUnique({ where: { companyId } }),
      prisma.lead.findMany({
        where: { companyId, stage: { not: "LOST" } },
        orderBy: { createdAt: "desc" },
        include: { project: { select: { name: true } } },
      }),
    ]);

  const stats: DeveloperLeadsData["stats"] = [
    { id: "new", label: "طلبات جديدة", value: toArabicDigits(newCount), delta: `▲ ${toArabicDigits(newTodayCount)} اليوم`, deltaDirection: "up", icon: "✉" },
    { id: "active", label: "قيد المتابعة", value: toArabicDigits(activeCount), delta: "عبر كل المشاريع", deltaDirection: "up", icon: "☺" },
    { id: "viewings", label: "معاينات مجدولة", value: toArabicDigits(viewingCount), delta: "هذا الأسبوع", deltaDirection: "up", icon: "◷" },
    { id: "rate", label: "معدّل التحويل", value: formatPercent(summary?.leadsConversionRate ?? 0), delta: `${formatDelta(summary?.leadsConversionDelta ?? 0)} عن الشهر الماضي`, deltaDirection: (summary?.leadsConversionDelta ?? 0) >= 0 ? "up" : "down", icon: "◔" },
  ];

  return {
    stats,
    stageFilters: [
      { key: "all", label: "الكل" },
      { key: "new", label: "جديد" },
      { key: "contacted", label: "تم التواصل" },
      { key: "viewing", label: "معاينة" },
      { key: "negotiating", label: "تفاوض" },
      { key: "won", label: "مغلق" },
    ],
    leads: leads.map((lead) => ({
      id: lead.id,
      name: lead.buyerName,
      initials: initialOf(lead.buyerName),
      tone: toneFromString(lead.buyerName),
      project: lead.unitLabel
        ? `${lead.project.name} · ${lead.unitLabel}`
        : lead.project.name,
      phone: formatPhone(lead.phone),
      source: leadSourceToAr(lead.source),
      stage: leadStageToUi(lead.stage),
      date: formatRelativeArabic(lead.createdAt),
    })),
  };
});
