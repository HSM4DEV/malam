"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerAction, type RegisterState } from "@/lib/actions/register";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <div className="rev">
      <h1 className="mb-2 font-serif text-[clamp(30px,3.4vw,44px)] leading-[1.12] font-semibold">
        أنشئ حسابك
      </h1>
      <p className="mb-6 text-[15px] leading-[1.7] font-light text-muted-strong">
        انضمّ إلى مَعلم وابدأ رحلتك في العقار الفاخر.
      </p>

      <div className="mb-5 flex gap-2 rounded-xl bg-sand p-[5px]">
        <span className="flex-1 rounded-[9px] bg-surface py-2.5 text-center text-[13.5px] font-semibold text-pine shadow-sm">
          مشترٍ / مستثمر
        </span>
        <Link
          href="/register/apply"
          className="flex-1 rounded-[9px] py-2.5 text-center text-[13.5px] font-medium text-muted-dark transition-colors hover:text-pine"
        >
          مطوّر / وسيط
        </Link>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="الاسم الأول">
            <Input name="firstName" placeholder="محمد" required />
          </Field>
          <Field label="اسم العائلة">
            <Input name="lastName" placeholder="العتيبي" required />
          </Field>
        </div>

        <Field label="البريد الإلكتروني">
          <Input type="email" name="email" placeholder="you@email.com" dir="ltr" className="text-end" required />
        </Field>

        <Field label="كلمة المرور">
          <Input type="password" name="password" placeholder="••••••••" dir="ltr" className="text-end" minLength={8} required />
        </Field>

        <label className="flex items-start gap-2.5 text-[13px] font-normal text-muted-strong">
          <input type="checkbox" required className="mt-0.5 w-auto" />
          <span>
            أوافق على <span className="font-semibold text-pine">شروط الاستخدام</span> و
            <span className="font-semibold text-pine">سياسة الخصوصية</span>.
          </span>
        </label>

        {state.error ? <p className="text-[13px] text-clay">{state.error}</p> : null}

        <Button type="submit" disabled={pending} className="mt-1 h-[52px] text-[15px]">
          {pending ? "جارٍ إنشاء الحساب…" : "إنشاء الحساب"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-strong">
        <span>لديك حساب بالفعل؟ </span>
        <Link href="/login" className="font-semibold text-pine">
          سجّل الدخول
        </Link>
      </div>
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
