import { KpiCard } from "@/components/dashboard/kpi-card";
import type { KpiMetric } from "@/types/dashboard";

export function StatsRow({ stats }: { stats: KpiMetric[] }) {
  return (
    <div className="grid grid-cols-1 gap-[18px] dash-sm:grid-cols-2 dash:grid-cols-4">
      {stats.map((stat, i) => (
        <KpiCard key={stat.id} kpi={stat} index={i} />
      ))}
    </div>
  );
}
