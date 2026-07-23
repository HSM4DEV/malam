import type { Metadata } from "next";

import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { StatsRow } from "@/components/dashboard/stats-row";
import { getDeveloperLeads } from "@/lib/data/developer-leads";

export const metadata: Metadata = {
  title: "الطلبات · لوحة تحكم المطوّر · مَعلم",
};

export default async function DeveloperLeadsPage() {
  const { stats, stageFilters, leads } = await getDeveloperLeads();

  return (
    <>
      <DeveloperTopbar
        eyebrow="إدارة العلاقات"
        title="الطلبات"
        searchPlaceholder="ابحث عن عميل…"
      />

      <div className="flex flex-col gap-6 px-8 py-7">
        <StatsRow stats={stats} />
        <LeadsTable leads={leads} stageFilters={stageFilters} />
      </div>
    </>
  );
}
