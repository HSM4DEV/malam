"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaudiRiyal } from "@/components/ui/saudi-riyal";
import { setDealValueAction } from "@/lib/actions/set-deal-value";
import { updateCommissionRateAction } from "@/lib/actions/update-commission-rate";
import type { CommissionFormState } from "@/lib/validation/commission";
import type { CommissionDeal } from "@/types/dashboard";

const initialState: CommissionFormState = {};

export function CommissionsPanel({
  ratePercent,
  totalLabel,
  deals,
}: {
  ratePercent: number;
  totalLabel: string;
  deals: CommissionDeal[];
}) {
  const [rateState, rateFormAction, ratePending] = useActionState(updateCommissionRateAction, initialState);

  return (
    <div className="flex flex-col gap-5">
      <div className="animate-fade-up flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-foreground/9 bg-surface px-[26px] py-6">
        <div>
          <div className="text-[13px] text-muted-strong">إجمالي العمولات (كل الصفقات المُقيَّمة)</div>
          <div className="font-serif text-[34px] font-semibold text-pine">
            {totalLabel}
            <SaudiRiyal />
          </div>
        </div>

        <form action={rateFormAction} className="flex items-end gap-2.5">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-muted-strong">
              معدّل العمولة (%)
            </label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="100"
              name="commissionRatePercent"
              defaultValue={ratePercent}
              className="w-[110px]"
            />
          </div>
          <Button type="submit" disabled={ratePending} variant="outline">
            {ratePending ? "جارٍ الحفظ…" : "حفظ"}
          </Button>
        </form>
      </div>
      {rateState.error ? <p className="text-[13px] text-clay">{rateState.error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-foreground/9 bg-surface">
        <div className="border-b border-foreground/9 px-[26px] py-[18px] font-serif text-xl font-semibold">
          الصفقات المُغلقة
        </div>
        {deals.length === 0 ? (
          <p className="px-[26px] py-10 text-center text-sm text-muted">لا صفقات مُغلقة بعد.</p>
        ) : (
          deals.map((deal) => <DealRow key={deal.id} deal={deal} />)
        )}
      </div>
    </div>
  );
}

function DealRow({ deal }: { deal: CommissionDeal }) {
  const [state, formAction, pending] = useActionState(setDealValueAction, initialState);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/6 px-[26px] py-4 last:border-b-0">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{deal.buyerName}</div>
        <div className="truncate text-[12.5px] text-muted">{deal.project}</div>
      </div>

      {deal.dealValueMillions != null ? (
        <div className="text-end">
          <div className="text-[12.5px] text-muted">
            قيمة الصفقة: {deal.dealValueLabel}
            <SaudiRiyal />
          </div>
          <div className="font-serif text-base font-semibold text-pine">
            {deal.commissionLabel}
            <SaudiRiyal />
          </div>
        </div>
      ) : (
        <form action={formAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={deal.id} />
          <Input
            type="number"
            step="0.1"
            min="0"
            name="dealValueMillions"
            placeholder="قيمة الصفقة (م)"
            required
            className="h-9 w-[150px] text-sm"
          />
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "جارٍ الحفظ…" : "حفظ"}
          </Button>
        </form>
      )}
      {state.error ? <p className="w-full text-[13px] text-clay">{state.error}</p> : null}
    </div>
  );
}
