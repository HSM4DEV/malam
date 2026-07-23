"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const TABS = ["شراء", "إيجار", "مشاريع جديدة"] as const;

export function HeroSearch() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("شراء");
  const router = useRouter();

  return (
    <div className="mt-9 max-w-[600px] rounded-[18px] border border-foreground/10 bg-surface p-3.5 shadow-[0_24px_50px_-30px_rgba(23,24,26,.35)]">
      <div className="mb-3 flex gap-1.5">
        {TABS.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setTab(label)}
            className={`rounded-[9px] px-[18px] py-2.5 text-[13.5px] font-semibold transition-colors ${
              tab === label ? "bg-pine text-cream" : "text-muted-strong hover:text-pine"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <div className="flex-[1.2] rounded-xl border border-foreground/10 px-4 py-2.5">
          <div className="mb-0.5 text-[11px] font-semibold text-muted">الموقع</div>
          <div className="text-[14.5px] font-medium">الرياض</div>
        </div>
        <div className="flex-1 rounded-xl border border-foreground/10 px-4 py-2.5">
          <div className="mb-0.5 text-[11px] font-semibold text-muted">النوع</div>
          <div className="text-[14.5px] font-medium">فيلا</div>
        </div>
        <div className="flex-1 rounded-xl border border-foreground/10 px-4 py-2.5">
          <div className="mb-0.5 text-[11px] font-semibold text-muted">السعر</div>
          <div className="text-[14.5px] font-medium">أي ميزانية</div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/projects")}
          className="flex items-center justify-center gap-2 rounded-xl bg-pine px-6 py-3 text-[14.5px] font-semibold text-cream transition-colors hover:bg-pine-dark"
        >
          <Search className="size-4" aria-hidden="true" />
          ابحث
        </button>
      </div>
    </div>
  );
}
