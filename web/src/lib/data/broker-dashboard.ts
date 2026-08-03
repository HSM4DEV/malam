import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { formatArea, formatDelta, formatMillions, formatPercent, toArabicDigits } from "@/lib/format";
import { getDeveloperCompany } from "@/lib/data/company";
import { getBrokerDeals } from "@/lib/data/broker-deals";
import { getBrokerTasks } from "@/lib/data/broker-tasks";
import { unitStatusToUi } from "@/lib/data/mappers";
import type { BrokerOverviewData } from "@/types/dashboard";

const LISTINGS_PREVIEW_COUNT = 4;
const PIPELINE_PREVIEW_PER_COLUMN = 2;

export const getBrokerOverview = cache(async (): Promise<BrokerOverviewData> => {
  const company = await getDeveloperCompany();
  const companyId = company.id;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [activeDealsCount, totalClientsCount, monthlyDealValue, summary, deals, units, tasks] =
    await Promise.all([
      prisma.lead.count({
        where: { companyId, stage: { in: ["NEW", "CONTACTED", "VIEWING", "NEGOTIATING"] } },
      }),
      prisma.lead.count({ where: { companyId, stage: { not: "LOST" } } }),
      prisma.lead.aggregate({
        where: { companyId, stage: "WON", updatedAt: { gte: startOfMonth } },
        _sum: { dealValueMillions: true },
      }),
      prisma.analyticsSummary.findUnique({ where: { companyId } }),
      getBrokerDeals(),
      prisma.unit.findMany({
        where: { project: { companyId } },
        orderBy: { createdAt: "asc" },
        take: LISTINGS_PREVIEW_COUNT,
        include: { project: { select: { name: true } } },
      }),
      getBrokerTasks(),
    ]);

  const monthlyCommission = (monthlyDealValue._sum.dealValueMillions ?? 0) * (company.commissionRatePercent / 100);

  const kpis: BrokerOverviewData["kpis"] = [
    {
      id: "active-deals",
      label: "صفقاتٌ نشطة",
      value: toArabicDigits(activeDealsCount),
      delta: "عبر كل المشاريع",
      deltaDirection: "up",
      icon: "⇄",
    },
    {
      id: "potential-clients",
      label: "عملاءُ محتملون",
      value: toArabicDigits(totalClientsCount),
      delta: `${formatDelta(summary?.newLeadsDelta ?? 0)}`,
      deltaDirection: (summary?.newLeadsDelta ?? 0) >= 0 ? "up" : "down",
      icon: "☺",
    },
    {
      id: "close-rate",
      label: "معدّل الإغلاق",
      value: formatPercent(summary?.leadsConversionRate ?? 0),
      delta: `${formatDelta(summary?.leadsConversionDelta ?? 0)}`,
      deltaDirection: (summary?.leadsConversionDelta ?? 0) >= 0 ? "up" : "down",
      icon: "◔",
    },
    {
      id: "monthly-commission",
      label: "عمولات الشهر",
      value: formatMillions(monthlyCommission),
      delta: "من الصفقات المُغلقة",
      deltaDirection: "up",
      icon: "◈",
    },
  ];

  const pipeline: BrokerOverviewData["pipeline"] = deals.columns.map((column) => ({
    ...column,
    cards: column.cards.slice(0, PIPELINE_PREVIEW_PER_COLUMN),
  }));

  const listings: BrokerOverviewData["listings"] = units.map((unit) => ({
    id: unit.id,
    code: unit.code,
    typeName: unit.typeName,
    project: unit.project.name,
    area: formatArea(unit.areaSqm),
    floorLabel: unit.floorLabel,
    beds: unit.beds,
    priceLabel: formatMillions(unit.priceMillions),
    status: unitStatusToUi(unit.status),
  }));

  return { kpis, pipeline, listings, tasks };
});
