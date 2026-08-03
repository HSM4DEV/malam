"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { PRICES, TYPES } from "@/lib/data/project-filter-options";

const TABS = ["شراء", "إيجار", "مشاريع جديدة"] as const;

export function HeroSearch({ cities }: { cities: string[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("شراء");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const router = useRouter();

  function handleSearch() {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (tab === "مشاريع جديدة") params.set("sort", "newest");

    const query = params.toString();
    router.push(query ? `/projects?${query}` : "/projects");
  }

  return (
    <div className="mt-9 max-w-[600px] rounded-[18px] border border-foreground/10 bg-surface p-3.5 shadow-[0_24px_50px_-30px_rgba(23,24,26,.35)]">
      <div className="mb-3 flex gap-1.5">
        {TABS.map((label) =>
          label === "إيجار" ? (
            <button
              key={label}
              type="button"
              disabled
              title="قريبًا"
              className="cursor-not-allowed rounded-[9px] px-[18px] py-2.5 text-[13.5px] font-semibold text-muted-light opacity-60"
            >
              {label}
            </button>
          ) : (
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
          ),
        )}
      </div>
      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <label className="flex-[1.2] rounded-xl border border-foreground/10 px-4 py-2.5">
          <div className="mb-0.5 text-[11px] font-semibold text-muted">الموقع</div>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-[14.5px] font-medium text-foreground outline-none"
          >
            <option value="">كل المدن</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex-1 rounded-xl border border-foreground/10 px-4 py-2.5">
          <div className="mb-0.5 text-[11px] font-semibold text-muted">النوع</div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value === "كل الأنواع" ? "" : e.target.value)}
            className="w-full bg-transparent text-[14.5px] font-medium text-foreground outline-none"
          >
            {TYPES.map((t) => (
              <option key={t} value={t === "كل الأنواع" ? "" : t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex-1 rounded-xl border border-foreground/10 px-4 py-2.5">
          <div className="mb-0.5 text-[11px] font-semibold text-muted">السعر</div>
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-transparent text-[14.5px] font-medium text-foreground outline-none"
          >
            {PRICES.map((p) => (
              <option key={p.label} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 rounded-xl bg-pine px-6 py-3 text-[14.5px] font-semibold text-cream transition-colors hover:bg-pine-dark"
        >
          <Search className="size-4" aria-hidden="true" />
          ابحث
        </button>
      </div>
    </div>
  );
}
