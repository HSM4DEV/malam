"use client";

import { useState } from "react";

import { SaudiRiyal } from "@/components/ui/saudi-riyal";

function fmt(n: number): string {
  return Math.round(n).toLocaleString("ar-SA");
}

export function FinancingCalculator({ startPriceRiyals }: { startPriceRiyals: number }) {
  const [price, setPrice] = useState(startPriceRiyals);
  const [downPct, setDownPct] = useState(20);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(4.5);

  const down = (price * downPct) / 100;
  const loan = price - down;
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;
  const monthly =
    monthlyRate > 0 ? (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months)) : loan / months;

  return (
    <div className="rounded-[20px] bg-pine-dark p-9 text-[#EAF0ED]">
      <div className="mb-2 text-[12.5px] font-bold tracking-wide text-pine-mist">حاسبة التمويل</div>
      <h3 className="mb-6 font-serif text-[28px] font-semibold text-cream">
        احسب قسطك الشهري التقريبي
      </h3>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-5.5">
          <SliderField
            label="سعر العقار"
            value={`${fmt(price)}`}
            currency
            min={2_000_000}
            max={15_000_000}
            step={100_000}
            fieldValue={price}
            onChange={setPrice}
          />
          <SliderField
            label="الدفعة الأولى"
            value={`${downPct}٪ · ${fmt(down)}`}
            currency
            min={10}
            max={60}
            step={5}
            fieldValue={downPct}
            onChange={setDownPct}
          />
          <SliderField
            label="مدة التمويل"
            value={`${years} سنة`}
            min={5}
            max={30}
            step={1}
            fieldValue={years}
            onChange={setYears}
          />
          <SliderField
            label="نسبة الفائدة السنوية"
            value={`${rate.toFixed(1)}٪`}
            min={2}
            max={9}
            step={0.1}
            fieldValue={rate}
            onChange={setRate}
          />
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-pine-mist/25 bg-pine-mist/10 p-7">
          <div className="mb-2 text-[13.5px] text-pine-mist">القسط الشهري التقريبي</div>
          <div className="font-serif text-[46px] leading-none font-semibold text-cream">{fmt(monthly)}</div>
          <div className="mt-1 text-[13px] text-pine-mist">
            <SaudiRiyal /> / شهرياً
          </div>
          <div className="my-5.5 h-px bg-pine-mist/25" />
          <div className="mb-3 flex justify-between">
            <span className="text-[13.5px] text-pine-mist">مبلغ التمويل</span>
            <span className="text-[14.5px] font-semibold text-cream">
              {fmt(loan)} <SaudiRiyal />
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[13.5px] text-pine-mist">الدفعة الأولى</span>
            <span className="text-[14.5px] font-semibold text-cream">
              {fmt(down)} <SaudiRiyal />
            </span>
          </div>
          <div className="mt-4.5 text-[11.5px] leading-[1.6] text-pine-mist">
            * تقديرٌ استرشاديٌّ فقط ولا يُعدّ عرضاً تمويلياً. تواصل مع مستشارك لعرضٍ دقيق.
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  currency,
  min,
  max,
  step,
  fieldValue,
  onChange,
}: {
  label: string;
  value: string;
  currency?: boolean;
  min: number;
  max: number;
  step: number;
  fieldValue: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <span className="text-[13.5px] text-pine-mist">{label}</span>
        <span className="font-serif text-[17px] font-semibold text-cream">
          {value}
          {currency ? <SaudiRiyal /> : null}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={fieldValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full accent-pine-mist"
      />
    </div>
  );
}
