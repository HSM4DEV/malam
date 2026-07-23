"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";

import {
  subscribeNewsletterAction,
  type NewsletterState,
} from "@/lib/actions/subscribe-newsletter";

const initialState: NewsletterState = {};

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeNewsletterAction, initialState);

  if (state.success) {
    return (
      <div className="flex min-w-[280px] max-w-[440px] flex-1 items-center gap-2 text-cream">
        <Check className="size-4" aria-hidden="true" />
        <span className="text-[14.5px]">تم الاشتراك — شكراً لك.</span>
      </div>
    );
  }

  return (
    <div className="min-w-[280px] max-w-[440px] flex-1">
      <form action={formAction} className="flex gap-2.5">
        <input
          type="email"
          name="email"
          required
          placeholder="بريدك الإلكتروني"
          dir="ltr"
          className="flex-1 rounded-xl border border-cream/30 bg-cream/10 px-4.5 py-3.5 text-end text-[14.5px] text-cream placeholder:text-cream/50 outline-none focus:border-cream/60"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-xl bg-cream px-6.5 py-3.5 text-[14.5px] font-semibold text-pine-dark transition-colors hover:bg-white disabled:opacity-70"
        >
          {pending ? "…" : "اشترك"}
        </button>
      </form>
      {state.error ? <p className="mt-2 text-[12.5px] text-clay">{state.error}</p> : null}
    </div>
  );
}
