import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { SaudiRiyal } from "@/components/ui/saudi-riyal";
import { toArabicDigits } from "@/lib/format";
import type { UnitRow, UnitStatus } from "@/types/dashboard";

const STATUS: Record<UnitStatus, { label: string; variant: "published" | "review" | "draft" }> = {
  available: { label: "متاح", variant: "published" },
  reserved: { label: "محجوز", variant: "review" },
  sold: { label: "مباع", variant: "draft" },
};

export function ListingsPreview({ units }: { units: UnitRow[] }) {
  return (
    <div className="animate-fade-up overflow-hidden rounded-2xl border border-foreground/9 bg-surface">
      <div className="flex items-center justify-between border-b border-foreground/9 px-[26px] py-[18px]">
        <div className="font-serif text-xl font-semibold">قوائمي الحصرية</div>
        <Link
          href="/dashboard/broker/listings"
          className="text-sm font-semibold text-pine hover:underline"
        >
          عرض الكل
        </Link>
      </div>

      <div className="flex flex-col">
        {units.map((unit) => (
          <div
            key={unit.id}
            className="flex items-center gap-4 border-b border-foreground/6 px-[26px] py-3.5 last:border-b-0"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14.5px] font-semibold">{unit.typeName}</div>
              <div className="truncate text-[12.5px] text-muted">
                {unit.project} · {toArabicDigits(unit.beds)}غ · {unit.area}
              </div>
            </div>
            <div className="shrink-0 text-left">
              <div className="font-serif text-[15px] font-semibold text-pine">
                {unit.priceLabel}
                <SaudiRiyal />
              </div>
              <Badge variant={STATUS[unit.status].variant}>{STATUS[unit.status].label}</Badge>
            </div>
          </div>
        ))}
        {units.length === 0 ? (
          <div className="px-[26px] py-10 text-center text-sm text-muted">لا توجد قوائم بعد.</div>
        ) : null}
      </div>
    </div>
  );
}
