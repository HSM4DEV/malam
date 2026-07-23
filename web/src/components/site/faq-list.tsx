"use client";

import { useMemo, useState } from "react";
import { HelpCircle, Plus } from "lucide-react";

export interface FaqItem {
  category: string;
  q: string;
  a: string;
}

const CATEGORIES = ["الكل", "عام", "للمشترين", "للمطوّرين", "للوسطاء"] as const;

export function FaqList({ items }: { items: FaqItem[] }) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("الكل");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const visible = useMemo(() => {
    const q = query.trim();
    let list = category === "الكل" ? items : items.filter((i) => i.category === category);
    if (q) list = list.filter((i) => `${i.q} ${i.a}`.includes(q));
    return list;
  }, [items, category, query]);

  return (
    <div>
      <div className="relative mx-auto mt-9 max-w-[560px]">
        <span className="absolute end-4.5 top-1/2 -translate-y-1/2 text-muted">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M11 11 L14.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن سؤالك…"
          className="w-full rounded-2xl border border-foreground/16 bg-surface px-4.5 py-4 pe-12 text-[15px] text-foreground shadow-[0_14px_30px_-22px_rgba(23,24,26,.4)] outline-none focus:border-pine"
        />
      </div>

      <div className="mt-14 grid grid-cols-1 items-start gap-9 md:grid-cols-[260px_1fr] md:gap-12">
        <aside className="md:sticky md:top-24">
          <div className="mb-3.5 text-[11.5px] font-bold tracking-wide text-muted">التصنيفات</div>
          <div className="flex flex-row flex-wrap gap-1 md:flex-col">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-[11px] px-4 py-2.5 text-start text-sm transition-colors ${
                  c === category ? "bg-sage font-semibold text-pine" : "text-muted-strong hover:bg-sand"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mt-7 rounded-2xl border border-foreground/10 bg-surface p-5.5">
            <div className="mb-1.5 font-serif text-[19px] font-semibold">لم تجد إجابتك؟</div>
            <p className="mb-4 text-[13.5px] leading-[1.7] font-light text-muted-strong">
              فريقنا جاهزٌ للرد خلال ساعات العمل.
            </p>
            <a
              href="/contact"
              className="block rounded-[11px] bg-pine py-3 text-center text-[13.5px] font-semibold text-cream transition-colors hover:bg-pine-dark"
            >
              تواصل معنا
            </a>
          </div>
        </aside>

        <div>
          <div className="mb-4.5 text-[13.5px] text-muted-dark">{visible.length.toLocaleString("ar-EG")} سؤالاً</div>
          <div className="flex flex-col gap-3">
            {visible.map((item) => {
              const isOpen = Boolean(open[item.q]);
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-[14px] border border-foreground/10 bg-surface"
                >
                  <button
                    type="button"
                    onClick={() => setOpen((prev) => ({ ...prev, [item.q]: !prev[item.q] }))}
                    className="flex w-full items-center justify-between gap-4 px-6.5 py-5.5 text-start"
                  >
                    <span className="font-serif text-[19.5px] font-semibold">{item.q}</span>
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full transition-transform ${
                        isOpen ? "rotate-45 bg-pine text-cream" : "bg-sage text-pine"
                      }`}
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6.5 pb-6 text-[14.5px] leading-[1.9] font-light text-muted-strong">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-foreground/10 bg-surface px-5 py-16 text-center">
              <HelpCircle className="mx-auto mb-4.5 size-9 text-pine" aria-hidden="true" />
              <div className="mb-2 font-serif text-[22px] font-semibold">لا نتائج مطابقة</div>
              <p className="mx-auto max-w-[30ch] text-sm font-light text-muted-strong">
                جرّب كلماتٍ أخرى، أو تواصل معنا مباشرةً وسنسعد بمساعدتك.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
