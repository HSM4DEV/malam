import type { Metadata } from "next";

import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { StatsRow } from "@/components/dashboard/stats-row";
import { UnitsTable } from "@/components/dashboard/units-table";
import { getDeveloperUnits } from "@/lib/data/developer-units";

export const metadata: Metadata = {
  title: "الوحدات · لوحة تحكم المطوّر · مَعلم",
};

export default async function DeveloperUnitsPage() {
  const { stats, statusFilters, units } = await getDeveloperUnits();

  return (
    <>
      <DeveloperTopbar
        eyebrow="المخزون"
        title="الوحدات"
        searchPlaceholder="ابحث برقم الوحدة…"
        action={{ label: "وحدة جديدة" }}
      />

      <div className="flex flex-col gap-6 px-8 py-7">
        <StatsRow stats={stats} />
        <UnitsTable units={units} statusFilters={statusFilters} />
      </div>
    </>
  );
}
