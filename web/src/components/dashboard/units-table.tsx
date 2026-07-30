"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { DeleteButton } from "@/components/dashboard/delete-button";
import { FilterChips } from "@/components/dashboard/filter-chips";
import { Badge } from "@/components/ui/badge";
import { SaudiRiyal } from "@/components/ui/saudi-riyal";
import { deleteUnitAction } from "@/lib/actions/delete-unit";
import { toArabicDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  UnitRow,
  UnitStatus,
  UnitStatusFilter,
} from "@/types/dashboard";

const COLUMN_TEMPLATE = "grid-cols-[1.4fr_1.4fr_1fr_1fr_0.7fr_1fr_80px]";

const STATUS: Record<UnitStatus, { label: string; variant: "published" | "review" | "draft" }> = {
  available: { label: "متاح", variant: "published" },
  reserved: { label: "محجوز", variant: "review" },
  sold: { label: "مباع", variant: "draft" },
};

export function UnitsTable({
  units,
  statusFilters,
  basePath,
}: {
  units: UnitRow[];
  statusFilters: UnitStatusFilter[];
  basePath: string;
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
        <div className="min-w-[840px]">
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
            <span />
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
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`${basePath}/${unit.id}/edit`}
                    title="تعديل"
                    className="flex size-9 items-center justify-center rounded-[9px] text-muted-light transition-colors hover:bg-sage hover:text-pine"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                  <DeleteButton
                    id={unit.id}
                    action={deleteUnitAction}
                    confirmMessage={`هل تريد حذف الوحدة ${unit.code}؟ لا يمكن التراجع عن هذا الإجراء.`}
                  />
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
