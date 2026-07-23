"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitInquiryAction, type InquiryState } from "@/lib/actions/submit-inquiry";

const initialState: InquiryState = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitInquiryAction, initialState);

  if (state.success) {
    return (
      <div className="rounded-[22px] border border-foreground/10 bg-surface px-9 py-14 text-center shadow-[0_30px_60px_-38px_rgba(23,24,26,.4)]">
        <CheckCircle2 className="mx-auto mb-5.5 size-12 text-pine" aria-hidden="true" />
        <h2 className="mb-3 font-serif text-[30px] font-semibold">تم إرسال رسالتك</h2>
        <p className="mx-auto max-w-[34ch] text-[15px] leading-[1.8] font-light text-muted-strong">
          شكراً لتواصلك مع مَعلم. سيرد عليك أحد مستشارينا في أقرب وقت.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[22px] border border-foreground/10 bg-surface px-8 py-9 shadow-[0_30px_60px_-38px_rgba(23,24,26,.4)]">
      <div className="mb-5.5 font-serif text-2xl font-semibold">أرسل لنا رسالة</div>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="type" value="CONTACT" />

        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
          <Field label="الاسم الكامل *">
            <Input name="name" placeholder="اسمك" required />
          </Field>
          <Field label="البريد الإلكتروني *">
            <Input type="email" name="email" placeholder="you@email.com" dir="ltr" className="text-end" required />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
          <Field label="رقم الجوال">
            <Input name="phone" placeholder="+966 5X XXX XXXX" dir="ltr" className="text-end" />
          </Field>
          <Field label="أنا">
            <select
              name="role"
              className="h-11 w-full rounded-[11px] border border-input bg-surface px-4 text-sm text-foreground outline-none focus-visible:border-ring"
            >
              <option>مشترٍ مهتم</option>
              <option>مطوّر</option>
              <option>وسيط عقاري</option>
              <option>أخرى</option>
            </select>
          </Field>
        </div>

        <Field label="الموضوع">
          <select
            name="subject"
            className="h-11 w-full rounded-[11px] border border-input bg-surface px-4 text-sm text-foreground outline-none focus-visible:border-ring"
          >
            <option>استفسارٌ عن مسكن</option>
            <option>تسويق مشروع</option>
            <option>انضمام كوسيط</option>
            <option>الدعم والحساب</option>
          </select>
        </Field>

        <Field label="رسالتك *">
          <textarea
            name="message"
            rows={4}
            placeholder="كيف يمكننا مساعدتك؟"
            required
            className="w-full rounded-[12px] border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus-visible:border-ring"
          />
        </Field>

        {state.error ? <p className="text-[13px] text-clay">{state.error}</p> : null}

        <Button type="submit" disabled={pending} className="h-[52px] text-[15px]">
          {pending ? "جارٍ الإرسال…" : "إرسال الرسالة"}
        </Button>
        <p className="text-center text-xs leading-[1.6] text-muted">
          نحترم خصوصيتك ولن نشارك بياناتك مع أي طرفٍ ثالث.
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
