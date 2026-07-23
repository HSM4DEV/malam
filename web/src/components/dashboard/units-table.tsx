"use client";

import { useMemo, useState } from "react";

import { FilterChips } from "@/components/dashboard/filter-chips";
import { Badge } from "@/components/ui/badge";
import { SaudiRiyal } from "@/components/ui/saudi-riyal";
import { toArabicDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  UnitRow,
  UnitStatus,
  UnitStatusFilter,
} from "@/types/dashboard";

const COLUMN_TEMPLATE = "grid-cols-[1.4fr_1.4fr_1fr_1fr_0.7fr_1fr]";

const STATUS: Record<UnitStatus, { label: string; variant: "published" | "review" | "draft" }> = {
  available: { label: "متاح", variant: "published" },
  reserved: { label: "محجوز", variant: "review" },
  sold: { label: "مباع", variant: "draft" },
};

export function UnitsTable({
  units,
  statusFilters,
}: {
  units: UnitRow[];
  statusFilters: UnitStatusFilter[];
}) {
  const [active, setActive] = useState<UnitStatusFilter["key"]>("all");

  const filtered = useMemo(
    () => (active === "all" ? units : units.filter((u) => u.status === active)),
    [units, active],
  );

  return (
    <div className="animate-fade-up overflow-hidden rounded-2xl border border-foreground/9 bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/9 px-[26px] py-[22px]">
        <div className="font-serif text-xl font-semibold">مخزون الوحدات</div>
        <FilterChips items={statusFilters} active={active} onChange={setActive} />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div
            className={cn(
              "grid gap-4 border-b border-foreground/8 px-[26px] py-3.5 text-xs font-semibold text-muted",
              COLUMN_TEMPLATE,
            )}
          >
            <span>الوحدة</span>
            <span>المشروع</span>
            <span>المساحة</span>
            <span>الطابق</span>
            <span>الغرف</span>
            <span>السعر / الحالة</span>
          </div>

          {filtered.length > 0 ? (
            filtered.map((unit) => (
              <div
                key={unit.id}
                className={cn(
                  "grid items-center gap-4 border-b border-foreground/6 px-[26px] py-4 transition-colors hover:bg-cream",
                  COLUMN_TEMPLATE,
                )}
              >
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold">{unit.typeName}</div>
                  <div className="text-[12px] text-muted">{unit.code}</div>
                </div>
                <span className="truncate text-sm text-muted-strong">{unit.project}</span>
                <span className="text-sm text-muted-strong">{unit.area}</span>
                <span className="text-sm text-muted-strong">{unit.floorLabel}</span>
                <span className="text-sm text-muted-strong">{toArabicDigits(unit.beds)}</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-serif text-[15px] font-semibold text-pine">
                    {unit.priceLabel}
                    <SaudiRiyal />
                  </span>
                  <Badge variant={STATUS[unit.status].variant}>{STATUS[unit.status].label}</Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="px-[26px] py-14 text-center text-sm text-muted">
              لا توجد وحدات مطابقة لهذا الفلتر.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
