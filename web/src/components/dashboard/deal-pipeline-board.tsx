import type { DealColumn, DealStage } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const COLUMN_BORDER: Record<DealStage, string> = {
  new: "border-pine-mist",
  viewing: "border-amber",
  negotiating: "border-clay",
  won: "border-pine",
};

export function DealPipelineBoard({ columns }: { columns: DealColumn[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 dash-sm:grid-cols-2 dash:grid-cols-4">
      {columns.map((column) => (
        <div key={column.key}>
          <div
            className={cn(
              "mb-3 flex items-center justify-between border-b-2 pb-2.5",
              COLUMN_BORDER[column.key],
            )}
          >
            <span className="text-[13.5px] font-semibold">{column.title}</span>
            <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs text-muted">
              {column.count}
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {column.cards.map((card) => (
              <div
                key={card.id}
                className="rounded-xl border border-foreground/8 bg-cream px-3.5 py-3.5 transition-transform hover:-translate-y-0.5"
              >
                <div className="mb-1 text-[13.5px] font-semibold">{card.name}</div>
                <div className="mb-2.5 text-xs text-muted">{card.project}</div>
                <div className="text-[11px] text-muted-light">{card.time}</div>
              </div>
            ))}
            {column.cards.length === 0 ? (
              <div className="rounded-xl border border-dashed border-foreground/18 px-5 py-5 text-center text-[12.5px] text-muted-light">
                لا صفقات هنا بعد
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
