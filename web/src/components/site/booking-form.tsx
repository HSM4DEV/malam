"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitBookingAction, type BookingState } from "@/lib/actions/submit-booking";

const initialState: BookingState = {};

export function BookingForm({
  projectId,
  projectName,
  activeUnitLabel,
}: {
  projectId: string;
  projectName: string;
  activeUnitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(submitBookingAction, initialState);

  if (state.success) {
    return (
      <div className="rounded-[20px] border border-foreground/10 bg-surface px-9 py-12 text-center">
        <CheckCircle2 className="mx-auto mb-4.5 size-[46px] text-pine" aria-hidden="true" />
        <h3 className="mb-2.5 font-serif text-[28px] font-semibold">تم استلام طلبك</h3>
        <p className="mx-auto max-w-[36ch] text-[15px] font-light text-muted-strong">
          سيتواصل معك مستشارك الخاص لتأكيد موعد المعاينة. نتطلّع للقائك.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-foreground/10 bg-surface px-9 py-8">
      <h3 className="mb-5 font-serif text-2xl font-semibold">رتّب زيارتك الخاصّة لـ{projectName}</h3>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="projectId" value={projectId} />
        {activeUnitLabel ? <input type="hidden" name="unitLabel" value={activeUnitLabel} /> : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="الاسم الكامل *">
            <Input name="buyerName" placeholder="اسمك" required />
          </Field>
          <Field label="رقم الجوال *">
            <Input name="phone" placeholder="+966 5X XXX XXXX" dir="ltr" className="text-end" required />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="التاريخ المفضّل">
            <Input type="date" name="preferredDate" dir="ltr" className="text-end" />
          </Field>
          <Field label="الوقت">
            <select
              name="preferredTime"
              className="h-11 w-full rounded-[11px] border border-input bg-surface px-4 text-sm text-foreground outline-none focus-visible:border-ring"
            >
              <option>صباحاً</option>
              <option>ظهراً</option>
              <option>مساءً</option>
            </select>
          </Field>
        </div>

        <Field label="نوع الزيارة">
          <select
            name="visitType"
            className="h-11 w-full rounded-[11px] border border-input bg-surface px-4 text-sm text-foreground outline-none focus-visible:border-ring"
          >
            <option>معاينة حضورية</option>
            <option>جولة افتراضية</option>
          </select>
        </Field>

        {state.error ? <p className="text-[13px] text-clay">{state.error}</p> : null}

        <Button type="submit" disabled={pending} className="h-[52px] text-[15px]">
          {pending ? "جارٍ الإرسال…" : "تأكيد الحجز"}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-muted-strong">{label}</label>
      {children}
    </div>
  );
}
