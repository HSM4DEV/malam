"use client";

import { useState } from "react";
import Image from "next/image";

import { SaudiRiyal } from "@/components/ui/saudi-riyal";
import { formatArea, formatMillions, toArabicDigits } from "@/lib/format";
import type { PublicUnitType } from "@/types/public";

const STATUS_LABEL: Record<PublicUnitType["status"], string> = {
  available: "متاحة",
  reserved: "محجوزة",
  sold: "مباعة",
};

export function UnitTypeSelector({
  unitTypes,
  imageSeed,
}: {
  unitTypes: PublicUnitType[];
  imageSeed: string;
}) {
  const [active, setActive] = useState(0);
  if (unitTypes.length === 0) return null;
  const unit = unitTypes[active];

  return (
    <div>
      <div className="mb-5.5 flex flex-wrap gap-2">
        {unitTypes.map((u, i) => (
          <button
            key={u.typeName}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-[11px] px-5 py-2.5 text-[13.5px] font-medium transition-colors ${
              i === active
                ? "border border-pine bg-pine text-cream"
                : "border border-foreground/15 text-muted-strong hover:border-pine hover:text-pine"
            }`}
          >
            {u.typeName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 overflow-hidden rounded-[18px] border border-foreground/10 bg-surface sm:grid-cols-[1.2fr_1fr]">
        <div className="relative min-h-[260px] bg-sand">
          <Image
            src={`https://picsum.photos/seed/${imageSeed}-unit-${active}/1000/750.webp`}
            alt={`مخطط ${unit.typeName}`}
            fill
            sizes="(max-width: 640px) 100vw, 500px"
            className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center px-7 py-8">
          <h3 className="mb-1.5 font-serif text-[28px] font-semibold">{unit.typeName}</h3>
          <div className="mb-5.5 text-sm text-muted-dark">
            {STATUS_LABEL[unit.status]} · {toArabicDigits(unit.count)} وحدة من هذا النوع
          </div>
          <div className="mb-6 flex flex-col gap-3">
            <Row k="المساحة" v={formatArea(unit.areaSqm)} />
            <Row k="غرف النوم" v={toArabicDigits(unit.beds)} />
            <Row k="الحمّامات" v={toArabicDigits(unit.baths)} />
            <Row k="الطابق" v={unit.floorLabel} />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs text-muted">يبدأ من</div>
              <div className="font-serif text-[28px] font-semibold text-pine">
                {formatMillions(unit.priceMillions)}
                <SaudiRiyal />
              </div>
            </div>
            <a
              href="#book"
              className="rounded-[11px] bg-pine px-5.5 py-3 text-[13.5px] font-semibold text-cream transition-colors hover:bg-pine-dark"
            >
              اطلب هذه الوحدة
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-foreground/9 pb-3">
      <span className="text-[13.5px] text-muted">{k}</span>
      <span className="text-[14.5px] font-semibold">{v}</span>
    </div>
  );
}
