"use client";

import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPasswordAction, type ResetPasswordState } from "@/lib/actions/reset-password";

const initialState: ResetPasswordState = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);

  return (
    <div className="rev">
      <h1 className="mb-2 font-serif text-[clamp(30px,3.4vw,44px)] leading-[1.12] font-semibold">
        تعيين كلمة مرور جديدة
      </h1>
      <p className="mb-7 text-[15px] leading-[1.7] font-light text-muted-strong">
        اختر كلمة مرور جديدة لحسابك.
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="token" value={token} />
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-muted-strong">
            كلمة المرور الجديدة
          </label>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            dir="ltr"
            className="text-end"
            minLength={8}
            required
          />
        </div>

        {state.error ? <p className="text-[13px] text-clay">{state.error}</p> : null}

        <Button type="submit" disabled={pending} className="mt-1 h-[52px] text-[15px]">
          {pending ? "جارٍ الحفظ…" : "حفظ كلمة المرور"}
        </Button>
      </form>
    </div>
  );
}
