import type { KpiMetric } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export function KpiCard({ kpi, index }: { kpi: KpiMetric; index: number }) {
  return (
    <div
      style={{ animationDelay: `${index * 0.05}s` }}
      className="animate-fade-up rounded-2xl border border-foreground/9 bg-surface px-6 py-[22px]"
    >
      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-[13px] text-muted-dark">{kpi.label}</span>
        <span className="flex size-[34px] items-center justify-center rounded-[10px] bg-sage text-[15px] text-pine">
          {kpi.icon}
        </span>
      </div>
      <div className="font-serif text-[34px] leading-none font-semibold">{kpi.value}</div>
      <div
        className={cn(
          "mt-2 text-[12.5px]",
          kpi.deltaDirection === "up" ? "text-pine" : "text-clay",
        )}
      >
        {kpi.delta} عن الشهر الماضي
      </div>
    </div>
  );
}
