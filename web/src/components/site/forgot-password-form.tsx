"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction, type ForgotPasswordState } from "@/lib/actions/forgot-password";

const initialState: ForgotPasswordState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, initialState);

  if (state.submitted) {
    return (
      <div className="rev text-center">
        <MailCheck className="mx-auto mb-4 size-10 text-pine" aria-hidden="true" />
        <h1 className="mb-2 font-serif text-[28px] font-semibold">تحقّق من بريدك</h1>
        <p className="text-[15px] leading-[1.7] font-light text-muted-strong">
          إن كان بريدك مسجّلاً لدينا، فقد أرسلنا إليه رابط إعادة تعيين كلمة المرور. الرابط صالحٌ
          لمدة ساعة واحدة.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-pine">
          العودة لتسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div className="rev">
      <h1 className="mb-2 font-serif text-[clamp(30px,3.4vw,44px)] leading-[1.12] font-semibold">
        استعادة كلمة المرور
      </h1>
      <p className="mb-7 text-[15px] leading-[1.7] font-light text-muted-strong">
        أدخل بريدك وسنرسل لك رابط إعادة التعيين.
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-muted-strong">
            البريد الإلكتروني
          </label>
          <Input type="email" name="email" placeholder="you@email.com" dir="ltr" className="text-end" required />
        </div>

        {state.error ? <p className="text-[13px] text-clay">{state.error}</p> : null}

        <Button type="submit" disabled={pending} className="mt-1 h-[52px] text-[15px]">
          {pending ? "جارٍ الإرسال…" : "إرسال الرابط"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-strong">
        <span>تذكّرت كلمة المرور؟ </span>
        <Link href="/login" className="font-semibold text-pine">
          العودة لتسجيل الدخول
        </Link>
      </div>
    </div>
  );
}
