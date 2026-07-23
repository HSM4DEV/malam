import type { TrafficSource } from "@/types/dashboard";

// On-palette accents cycled across sources.
const ACCENTS = ["#14453C", "#C4643C", "#9A6B18", "#8FBFB0"];

export function TrafficCard({ sources }: { sources: TrafficSource[] }) {
  return (
    <div className="animate-fade-up flex flex-col rounded-2xl border border-foreground/9 bg-surface px-[26px] py-6">
      <div className="font-serif text-xl font-semibold">مصادر الزيارات</div>
      <div className="mt-0.5 text-[12.5px] text-muted">آخر ٣٠ يوماً</div>

      {/* Stacked share bar */}
      <div className="mt-5 flex h-2.5 overflow-hidden rounded-full">
        {sources.map((source, i) => (
          <div
            key={source.label}
            style={{ width: `${source.pct}%`, background: ACCENTS[i % ACCENTS.length] }}
          />
        ))}
      </div>

      <div className="mt-5 flex flex-1 flex-col gap-3.5">
        {sources.map((source, i) => (
          <div key={source.label} className="flex items-center justify-between text-[13.5px]">
            <span className="flex items-center gap-2.5">
              <span
                className="size-2.5 rounded-full"
                style={{ background: ACCENTS[i % ACCENTS.length] }}
              />
              <span className="text-muted-strong">{source.label}</span>
            </span>
            <span className="font-semibold">{source.valueLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
