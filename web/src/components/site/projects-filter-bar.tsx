"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

const TYPES = ["كل الأنواع", "فيلا", "شقة", "بنتهاوس", "دوبلكس", "تاون هاوس"];
const BEDS = [
  { label: "كل الغرف", value: "" },
  { label: "+٣ غرف", value: "3" },
  { label: "+٤ غرف", value: "4" },
  { label: "+٥ غرف", value: "5" },
];
const PRICES = [
  { label: "أي سعر", value: "" },
  { label: "أقل من ٤ مليون", value: "4" },
  { label: "أقل من ٧ مليون", value: "7" },
  { label: "أقل من ١٢ مليون", value: "12" },
];
const SORTS = [
  { label: "الأحدث", value: "newest" },
  { label: "السعر: الأقل", value: "price-asc" },
  { label: "السعر: الأعلى", value: "price-desc" },
];

export function ProjectsFilterBar({ cities }: { cities: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const city = searchParams.get("city") ?? "الكل";
  const type = searchParams.get("type") ?? "كل الأنواع";
  const minBeds = searchParams.get("minBeds") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const hasFilters = Boolean(
    (city !== "الكل" ? 1 : 0) ||
      (type !== "كل الأنواع" ? 1 : 0) ||
      minBeds ||
      maxPrice ||
      searchParams.get("q"),
  );

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(`/projects?${params.toString()}`);
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (q !== (searchParams.get("q") ?? "")) updateParams({ q });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="sticky top-[74px] z-30 border-y border-foreground/8 bg-cream/92 backdrop-blur-md">
      <div className="mx-auto max-w-[1320px] px-5 py-4 sm:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2.5">
            <div className="relative flex items-center">
              <Search className="absolute end-3.5 size-4 text-muted" aria-hidden="true" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث بالاسم أو الحي…"
                className="w-[220px] rounded-[10px] border border-foreground/14 bg-surface py-2.5 pe-9 ps-3.5 text-[13.5px] text-foreground outline-none focus:border-pine"
              />
            </div>
            {["الكل", ...cities].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => updateParams({ city: c === "الكل" ? "" : c })}
                className={`rounded-full px-4.5 py-2.5 text-[13px] transition-colors ${
                  c === city
                    ? "border border-pine bg-pine font-semibold text-cream"
                    : "border border-foreground/15 text-muted-strong hover:border-pine hover:text-pine"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={type}
              onChange={(e) => updateParams({ type: e.target.value === "كل الأنواع" ? "" : e.target.value })}
              className="rounded-[10px] border border-foreground/14 bg-surface px-3.5 py-2.5 text-[13.5px] text-foreground outline-none focus:border-pine"
            >
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select
              value={minBeds}
              onChange={(e) => updateParams({ minBeds: e.target.value })}
              className="rounded-[10px] border border-foreground/14 bg-surface px-3.5 py-2.5 text-[13.5px] text-foreground outline-none focus:border-pine"
            >
              {BEDS.map((b) => (
                <option key={b.label} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            <select
              value={maxPrice}
              onChange={(e) => updateParams({ maxPrice: e.target.value })}
              className="rounded-[10px] border border-foreground/14 bg-surface px-3.5 py-2.5 text-[13.5px] text-foreground outline-none focus:border-pine"
            >
              {PRICES.map((p) => (
                <option key={p.label} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="rounded-[10px] border border-foreground/14 bg-surface px-3.5 py-2.5 text-[13.5px] text-foreground outline-none focus:border-pine"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasFilters ? (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                setQ("");
                router.push("/projects");
              }}
              className="text-[13px] text-muted underline"
            >
              مسح عوامل التصفية
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
