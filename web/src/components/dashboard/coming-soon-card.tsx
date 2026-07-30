import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ComingSoonCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
}

export function ComingSoonCard({ icon: Icon, title, description, ctaLabel }: ComingSoonCardProps) {
  return (
    <div className="animate-fade-up rounded-2xl border border-dashed border-foreground/20 bg-surface px-10 py-10 text-center">
      <div className="mx-auto mb-4 flex size-[54px] items-center justify-center rounded-2xl bg-sage text-pine">
        <Icon className="size-[22px]" aria-hidden="true" />
      </div>
      <div className="mb-2 font-serif text-[22px] font-semibold">{title}</div>
      <p className="mx-auto mb-5 max-w-[40ch] text-sm font-light text-muted-dark">{description}</p>
      <Button type="button" aria-disabled="true" title={`${ctaLabel} (قريبًا)`}>
        {ctaLabel}
      </Button>
    </div>
  );
}
