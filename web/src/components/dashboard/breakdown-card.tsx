import type { BreakdownBar } from "@/types/dashboard";

export function BreakdownCard({
  title,
  subtitle,
  bars,
}: {
  title: string;
  subtitle?: string;
  bars: BreakdownBar[];
}) {
  return (
    <div className="animate-fade-up rounded-2xl border border-foreground/9 bg-surface px-[26px] py-6">
      <div className="font-serif text-xl font-semibold">{title}</div>
      {subtitle ? <div className="mt-0.5 text-[12.5px] text-muted">{subtitle}</div> : null}

      <div className="mt-5 flex flex-col gap-4">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1.5 flex items-center justify-between text-[13px]">
              <span className="text-muted-strong">{bar.label}</span>
              <span className="font-semibold">{bar.valueLabel}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full origin-right animate-grow-x rounded-full bg-pine"
                style={{ width: `${bar.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
