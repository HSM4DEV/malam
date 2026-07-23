"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction, type LoginState } from "@/lib/actions/login";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="rev">
      <h1 className="mb-2 font-serif text-[clamp(30px,3.4vw,44px)] leading-[1.12] font-semibold">
        أهلاً بعودتك
      </h1>
      <p className="mb-7 text-[15px] leading-[1.7] font-light text-muted-strong">
        سجّل الدخول لإدارة مساكنك ومعايناتك ولوحتك.
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <Field label="البريد الإلكتروني">
          <Input type="email" name="email" placeholder="you@email.com" dir="ltr" className="text-end" required />
        </Field>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-[12.5px] font-semibold text-muted-strong">كلمة المرور</label>
            <Link href="/forgot-password" className="text-[12.5px] font-semibold text-pine">
              نسيت كلمة المرور؟
            </Link>
          </div>
          <Input type="password" name="password" placeholder="••••••••" dir="ltr" className="text-end" required />
        </div>

        {state.error ? <p className="text-[13px] text-clay">{state.error}</p> : null}

        <Button type="submit" disabled={pending} className="mt-1 h-[52px] text-[15px]">
          {pending ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-strong">
        <span>ليس لديك حساب؟ </span>
        <Link href="/register" className="font-semibold text-pine">
          أنشئ حساباً
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
