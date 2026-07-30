import type { Metadata } from "next";

import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { StatsRow } from "@/components/dashboard/stats-row";
import { UnitsTable } from "@/components/dashboard/units-table";
import { getDeveloperUnits } from "@/lib/data/developer-units";

export const metadata: Metadata = {
  title: "قوائمي · لوحة تحكم الوسيط · مَعلم",
};

export default async function BrokerListingsPage() {
  const { stats, statusFilters, units } = await getDeveloperUnits();

  return (
    <>
      <DeveloperTopbar
        eyebrow="المحفظة"
        title="قوائمي"
        searchPlaceholder="ابحث برقم الوحدة…"
      />

      <div className="flex flex-col gap-6 px-8 py-7">
        <StatsRow stats={stats} />
        <UnitsTable units={units} statusFilters={statusFilters} />
      </div>
    </>
  );
}
