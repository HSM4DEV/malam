"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitMarketProjectAction } from "@/lib/actions/submit-market-project";
import type { MarketProjectState } from "@/lib/validation/market-project";

const initialState: MarketProjectState = {};

const selectClassName =
  "h-11 w-full rounded-[11px] border border-input bg-surface px-4 text-sm text-foreground outline-none focus-visible:border-ring";

export function MarketProjectForm() {
  const [state, formAction, pending] = useActionState(submitMarketProjectAction, initialState);

  if (state.success) {
    return (
      <div className="rounded-[22px] border border-foreground/10 bg-surface px-9 py-14 text-center shadow-[0_30px_60px_-38px_rgba(23,24,26,.4)]">
        <CheckCircle2 className="mx-auto mb-5.5 size-12 text-pine" aria-hidden="true" />
        <h2 className="mb-3 font-serif text-[30px] font-semibold">وصلنا طلبك.</h2>
        <p className="mx-auto max-w-[34ch] text-[15px] leading-[1.8] font-light text-muted-strong">
          شكراً لثقتك. سيتواصل معك مستشار الشراكات خلال ٢٤ ساعة بعرضٍ مخصّص لمشروعك.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[22px] border border-foreground/10 bg-surface px-8 py-9 shadow-[0_30px_60px_-38px_rgba(23,24,26,.4)]">
      <div className="mb-1.5 font-serif text-2xl font-semibold">أخبِرنا عن مشروعك</div>
      <div className="mb-6 text-[13px] text-muted">الحقول المعلَّمة بـ * مطلوبة</div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
          <Field label="الاسم الكامل *">
            <Input name="name" placeholder="مثال: عبدالله المطيري" required />
          </Field>
          <Field label="اسم الشركة *">
            <Input name="companyName" placeholder="مجموعة التطوير" required />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
          <Field label="البريد الإلكتروني *">
            <Input type="email" name="email" placeholder="you@company.sa" dir="ltr" className="text-end" required />
          </Field>
          <Field label="رقم الجوال *">
            <Input name="phone" placeholder="+966 5X XXX XXXX" dir="ltr" className="text-end" required />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
          <Field label="المدينة">
            <select name="city" defaultValue="" className={selectClassName}>
              <option value="">اختر…</option>
              <option value="الرياض">الرياض</option>
              <option value="جدة">جدة</option>
              <option value="الدمام / الخبر">الدمام / الخبر</option>
              <option value="أخرى">أخرى</option>
            </select>
          </Field>
          <Field label="نوع المشروع">
            <select name="projectType" defaultValue="" className={selectClassName}>
              <option value="">اختر…</option>
              <option value="أبراج سكنية">أبراج سكنية</option>
              <option value="فلل / مجمّعات">فلل / مجمّعات</option>
              <option value="وحدات مختلطة">وحدات مختلطة</option>
              <option value="أخرى">أخرى</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
          <Field label="عدد الوحدات">
            <Input name="unitCount" placeholder="مثال: ١٢٠" />
          </Field>
          <Field label="نطاق السعر التقديري">
            <select name="priceRange" defaultValue="" className={selectClassName}>
              <option value="">اختر…</option>
              <option value="أقل من ٣ مليون">أقل من ٣ مليون</option>
              <option value="٣ – ٨ مليون">٣ – ٨ مليون</option>
              <option value="٨ – ٢٠ مليون">٨ – ٢٠ مليون</option>
              <option value="أكثر من ٢٠ مليون">أكثر من ٢٠ مليون</option>
            </select>
          </Field>
        </div>

        <Field label="نبذة عن المشروع">
          <textarea
            name="blurb"
            rows={3}
            placeholder="الموقع، مرحلة التطوير، وأي تفاصيل تودّ مشاركتها"
            className="w-full rounded-[12px] border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus-visible:border-ring"
          />
        </Field>

        {state.error ? <p className="text-[13px] text-clay">{state.error}</p> : null}

        <Button type="submit" disabled={pending} className="h-[52px] text-[15px]">
          {pending ? "جارٍ الإرسال…" : "أرسل الطلب"}
        </Button>

        <p className="text-center text-xs leading-[1.6] text-muted">
          بإرسالك الطلب فإنك توافق على{" "}
          <a href="#" className="text-pine">
            سياسة الخصوصية
          </a>
          . لن نشارك بياناتك مع أي طرفٍ ثالث.
        </p>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-semibold text-muted-strong">{label}</label>
      {children}
    </div>
  );
}
