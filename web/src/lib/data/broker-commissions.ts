import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { getDeveloperCompany } from "@/lib/data/company";
import { formatMillions } from "@/lib/format";
import type { BrokerCommissionsData, CommissionDeal } from "@/types/dashboard";

export const getBrokerCommissions = cache(async (): Promise<BrokerCommissionsData> => {
  const company = await getDeveloperCompany();
  const rate = company.commissionRatePercent;

  const wonLeads = await prisma.lead.findMany({
    where: { companyId: company.id, stage: "WON" },
    orderBy: { updatedAt: "desc" },
    include: { project: { select: { name: true } } },
  });

  let totalCommission = 0;
  const deals: CommissionDeal[] = wonLeads.map((lead) => {
    const commission = lead.dealValueMillions != null ? lead.dealValueMillions * (rate / 100) : null;
    if (commission != null) totalCommission += commission;

    return {
      id: lead.id,
      buyerName: lead.buyerName,
      project: lead.unitLabel ? `${lead.project.name} · ${lead.unitLabel}` : lead.project.name,
      dealValueMillions: lead.dealValueMillions,
      dealValueLabel: lead.dealValueMillions != null ? formatMillions(lead.dealValueMillions) : null,
      commissionLabel: commission != null ? formatMillions(commission) : null,
    };
  });

  return {
    ratePercent: rate,
    totalLabel: formatMillions(totalCommission),
    deals,
  };
});
