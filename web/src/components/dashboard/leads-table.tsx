"use client";

import { useMemo, useState } from "react";

import { FilterChips } from "@/components/dashboard/filter-chips";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LeadRecord, LeadStage, LeadStageFilter } from "@/types/dashboard";

const COLUMN_TEMPLATE = "grid-cols-[1.6fr_1.6fr_1.2fr_0.9fr_1fr_0.9fr]";

const STAGE: Record<
  LeadStage,
  { label: string; variant: "clay" | "draft" | "review" | "published" | "success" }
> = {
  new: { label: "جديد", variant: "clay" },
  contacted: { label: "تم التواصل", variant: "draft" },
  viewing: { label: "معاينة", variant: "review" },
  negotiating: { label: "تفاوض", variant: "published" },
  won: { label: "مغلق", variant: "success" },
};

export function LeadsTable({
  leads,
  stageFilters,
}: {
  leads: LeadRecord[];
  stageFilters: LeadStageFilter[];
}) {
  const [active, setActive] = useState<LeadStageFilter["key"]>("all");

  const filtered = useMemo(
    () => (active === "all" ? leads : leads.filter((l) => l.stage === active)),
    [leads, active],
  );

  return (
    <div className="animate-fade-up overflow-hidden rounded-2xl border border-foreground/9 bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/9 px-[26px] py-[22px]">
        <div className="font-serif text-xl font-semibold">كل الطلبات</div>
        <FilterChips items={stageFilters} active={active} onChange={setActive} />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[820px]">
          <div
            className={cn(
              "grid gap-4 border-b border-foreground/8 px-[26px] py-3.5 text-xs font-semibold text-muted",
              COLUMN_TEMPLATE,
            )}
          >
            <span>العميل</span>
            <span>المشروع</span>
            <span>رقم الهاتف</span>
            <span>المصدر</span>
            <span>المرحلة</span>
            <span>التاريخ</span>
          </div>

          {filtered.length > 0 ? (
            filtered.map((lead) => (
              <div
                key={lead.id}
                className={cn(
                  "grid items-center gap-4 border-b border-foreground/6 px-[26px] py-4 transition-colors hover:bg-cream",
                  COLUMN_TEMPLATE,
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "flex size-[38px] shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                      lead.tone === "pine" ? "bg-sage text-pine" : "bg-clay-soft text-clay",
                    )}
                  >
                    {lead.initials}
                  </span>
                  <span className="truncate text-sm font-semibold">{lead.name}</span>
                </div>
                <span className="truncate text-sm text-muted-strong">{lead.project}</span>
                <span dir="ltr" className="text-start text-sm text-muted-strong tabular-nums">
                  {lead.phone}
                </span>
                <span className="text-sm text-muted-strong">{lead.source}</span>
                <Badge variant={STAGE[lead.stage].variant}>{STAGE[lead.stage].label}</Badge>
                <span className="text-[12.5px] text-muted-light">{lead.date}</span>
              </div>
            ))
          ) : (
            <div className="px-[26px] py-14 text-center text-sm text-muted">
              لا توجد طلبات في هذه المرحلة.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
