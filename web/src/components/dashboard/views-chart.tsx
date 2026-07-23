"use client";

import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ChartRange, ViewsChartPoint } from "@/types/dashboard";

const RANGE_SUBTITLE: Record<ChartRange, string> = {
  weekly: "آخر ١٢ أسبوعاً",
  monthly: "آخر ١٢ شهراً",
};

export function ViewsChart({ chart }: { chart: Record<ChartRange, ViewsChartPoint[]> }) {
  const [range, setRange] = useState<ChartRange>("weekly");
  const points = chart[range];
  const maxIndex = points.length - 1;

  return (
    <div className="animate-fade-up rounded-2xl border border-foreground/9 bg-surface px-[26px] py-6">
      <div className="mb-[22px] flex items-center justify-between">
        <div>
          <div className="font-serif text-xl font-semibold">أداء المشاهدات</div>
          <div className="mt-0.5 text-[12.5px] text-muted">{RANGE_SUBTITLE[range]}</div>
        </div>
        <Tabs value={range} onValueChange={(v) => setRange(v as ChartRange)}>
          <TabsList>
            <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
            <TabsTrigger value="monthly">شهري</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex h-[200px] items-end gap-2" role="img" aria-label={`مخطط ${RANGE_SUBTITLE[range]}`}>
        {points.map((point, i) => (
          <div
            key={point.label}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <div
              style={{
                height: `${point.heightPct}%`,
                animationDelay: `${i * 0.05}s`,
              }}
              className={
                "w-full origin-bottom animate-grow-bar rounded-t-[6px] rounded-b-[3px] " +
                (i === maxIndex
                  ? "bg-gradient-to-b from-pine to-pine-dark"
                  : "bg-[#CBD9D2]")
              }
            />
            <span className="text-[10.5px] text-muted-light">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
