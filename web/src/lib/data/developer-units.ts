import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { formatArea, formatDelta, formatMillions, toArabicDigits } from "@/lib/format";
import { getDeveloperCompany, getDeveloperCompanyId } from "@/lib/data/company";
import { unitStatusToUi } from "@/lib/data/mappers";
import type { DeveloperUnitsData } from "@/types/dashboard";

export const getDeveloperUnits = cache(async (): Promise<DeveloperUnitsData> => {
  const company = await getDeveloperCompany();
  const companyId = company.id;

  const [aggregates, projectsWithUnits, summary, units] = await Promise.all([
    prisma.project.aggregate({
      where: { companyId },
      _sum: { totalUnits: true, soldUnits: true, reservedUnits: true },
    }),
    prisma.project.count({ where: { companyId, totalUnits: { gt: 0 } } }),
    prisma.analyticsSummary.findUnique({ where: { companyId } }),
    prisma.unit.findMany({
      where: { project: { companyId } },
      orderBy: { createdAt: "asc" },
      include: { project: { select: { name: true } } },
    }),
  ]);

  const total = aggregates._sum.totalUnits ?? 0;
  const sold = aggregates._sum.soldUnits ?? 0;
  const reserved = aggregates._sum.reservedUnits ?? 0;
  const available = Math.max(total - sold - reserved, 0);

  const stats: DeveloperUnitsData["stats"] = [
    { id: "total", label: "إجمالي الوحدات", value: toArabicDigits(total), delta: `عبر ${toArabicDigits(projectsWithUnits)} مشاريع`, deltaDirection: "up", icon: "▦" },
    { id: "available", label: "متاحة", value: toArabicDigits(available), delta: "جاهزة للحجز", deltaDirection: "up", icon: "◇" },
    { id: "reserved", label: "محجوزة", value: toArabicDigits(reserved), delta: "قيد التوثيق", deltaDirection: "up", icon: "⏳" },
    { id: "sold", label: "مباعة", value: toArabicDigits(sold), delta: `${formatDelta(summary?.unitsSoldDelta ?? 0)} عن الشهر الماضي`, deltaDirection: (summary?.unitsSoldDelta ?? 0) >= 0 ? "up" : "down", icon: "✓" },
  ];

  return {
    stats,
    statusFilters: [
      { key: "all", label: "الكل" },
      { key: "available", label: "متاح" },
      { key: "reserved", label: "محجوز" },
      { key: "sold", label: "مباع" },
    ],
    units: units.map((unit) => ({
      id: unit.id,
      code: unit.code,
      typeName: unit.typeName,
      project: unit.project.name,
      area: formatArea(unit.areaSqm),
      floorLabel: unit.floorLabel,
      beds: unit.beds,
      priceLabel: formatMillions(unit.priceMillions),
      status: unitStatusToUi(unit.status),
    })),
  };
});

/** A single unit, scoped to the current session's company — for the edit form. */
export async function getDeveloperUnitById(id: string) {
  const companyId = await getDeveloperCompanyId();
  return prisma.unit.findFirst({
    where: { id, project: { companyId } },
    include: { project: { select: { id: true, name: true } } },
  });
}
