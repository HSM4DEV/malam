import type { Metadata } from "next";

import { BreakdownCard } from "@/components/dashboard/breakdown-card";
import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { StatsRow } from "@/components/dashboard/stats-row";
import { TrafficCard } from "@/components/dashboard/traffic-card";
import { ViewsChart } from "@/components/dashboard/views-chart";
import { getDeveloperAnalytics } from "@/lib/data/developer-analytics";

export const metadata: Metadata = {
  title: "التحليلات · لوحة تحكم المطوّر · مَعلم",
};

export default async function DeveloperAnalyticsPage() {
  const { kpis, chart, viewsByProject, leadsByCity, trafficSources } =
    await getDeveloperAnalytics();

  return (
    <>
      <DeveloperTopbar
        eyebrow="الأداء"
        title="التحليلات"
        searchPlaceholder="ابحث في التقارير…"
      />

      <div className="flex flex-col gap-5 px-8 py-7">
        <StatsRow stats={kpis} />

        <div className="grid grid-cols-1 gap-5 dash:grid-cols-[1.5fr_1fr]">
          <ViewsChart chart={chart} />
          <TrafficCard sources={trafficSources} />
        </div>

        <div className="grid grid-cols-1 gap-5 dash:grid-cols-2">
          <BreakdownCard
            title="المشاهدات حسب المشروع"
            subtitle="آخر ٣٠ يوماً"
            bars={viewsByProject}
          />
          <BreakdownCard
            title="الطلبات حسب المدينة"
            subtitle="آخر ٣٠ يوماً"
            bars={leadsByCity}
          />
        </div>
      </div>
    </>
  );
}
