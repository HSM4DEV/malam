import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { formatRelativeArabic, toArabicDigits } from "@/lib/format";
import { getDeveloperCompany } from "@/lib/data/company";
import type { BrokerDealsData, DealCard, DealColumn, DealStage } from "@/types/dashboard";

// The design's 4-column pipeline collapses Lead.stage: NEW+CONTACTED share a
// column (both are "not yet met" states), WON is the only "closed" stage
// shown — LOST leads drop off the board entirely (they're still visible in
// the Clients table).
const STAGE_TO_COLUMN: Partial<Record<string, DealStage>> = {
  NEW: "new",
  CONTACTED: "new",
  VIEWING: "viewing",
  NEGOTIATING: "negotiating",
  WON: "won",
};

const COLUMN_TITLES: Record<DealStage, string> = {
  new: "جديد",
  viewing: "معاينة",
  negotiating: "تفاوض",
  won: "إغلاق",
};

const COLUMN_ORDER: DealStage[] = ["new", "viewing", "negotiating", "won"];

export const getBrokerDeals = cache(async (): Promise<BrokerDealsData> => {
  const company = await getDeveloperCompany();
  const companyId = company.id;

  const leads = await prisma.lead.findMany({
    where: { companyId, stage: { in: ["NEW", "CONTACTED", "VIEWING", "NEGOTIATING", "WON"] } },
    orderBy: { createdAt: "desc" },
    include: { project: { select: { name: true } } },
  });

  const cardsByColumn: Record<DealStage, DealCard[]> = {
    new: [],
    viewing: [],
    negotiating: [],
    won: [],
  };

  for (const lead of leads) {
    const column = STAGE_TO_COLUMN[lead.stage];
    if (!column) continue;
    cardsByColumn[column].push({
      id: lead.id,
      name: lead.buyerName,
      project: lead.unitLabel ? `${lead.project.name} · ${lead.unitLabel}` : lead.project.name,
      time: formatRelativeArabic(lead.createdAt),
    });
  }

  const columns: DealColumn[] = COLUMN_ORDER.map((key) => ({
    key,
    title: COLUMN_TITLES[key],
    count: toArabicDigits(cardsByColumn[key].length),
    cards: cardsByColumn[key],
  }));

  return { columns };
});
