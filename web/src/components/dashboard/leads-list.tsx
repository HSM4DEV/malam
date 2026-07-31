import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { LeadItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export function LeadsList({ leads, viewAllHref }: { leads: LeadItem[]; viewAllHref: string }) {
  return (
    <div className="animate-fade-up flex flex-col rounded-2xl border border-foreground/9 bg-surface px-[26px] py-6">
      <div className="mb-[18px] flex items-center justify-between">
        <div className="font-serif text-xl font-semibold">أحدث الطلبات</div>
        <Button asChild variant="link" size="sm" className="h-auto p-0 text-sm">
          <Link href={viewAllHref}>عرض الكل</Link>
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="flex items-center gap-3 rounded-[10px] px-2 py-3 transition-colors hover:bg-cream"
          >
            <span
              className={cn(
                "flex size-[38px] shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                lead.tone === "pine" ? "bg-sage text-pine" : "bg-clay-soft text-clay",
              )}
            >
              {lead.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{lead.name}</div>
              <div className="truncate text-[12.5px] text-muted">{lead.project}</div>
            </div>
            <span className="shrink-0 text-[11.5px] text-muted-light">{lead.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
