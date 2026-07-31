import Link from "next/link";
import { Search, Bell, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DeveloperTopbarProps {
  eyebrow: string;
  title: string;
  searchPlaceholder?: string;
  /** Optional primary CTA on the far side of the bar. If `href` is omitted, renders as a disabled "قريبًا" placeholder. */
  action?: { label: string; href?: string };
}

export function DeveloperTopbar({
  eyebrow,
  title,
  searchPlaceholder = "بحث…",
  action,
}: DeveloperTopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-5 border-b border-foreground/10 bg-background/90 px-8 py-[18px] backdrop-blur-md">
      <div>
        <div className="text-[12.5px] text-muted">{eyebrow}</div>
        <h1 className="font-serif text-[26px] leading-tight font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="relative hidden items-center sm:flex">
          <Search className="absolute end-3.5 size-4 text-muted" aria-hidden="true" />
          <Input placeholder={searchPlaceholder} className="w-[220px] ps-4 pe-10" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled
          title="الإشعارات (قريبًا)"
          className="relative"
        >
          <Bell className="size-4" aria-hidden="true" />
          <span className="absolute end-[11px] top-[9px] size-[7px] rounded-full bg-clay" />
        </Button>

        {action?.href ? (
          <Button asChild>
            <Link href={action.href}>
              <Plus className="size-4" aria-hidden="true" />
              {action.label}
            </Link>
          </Button>
        ) : action ? (
          <Button type="button" disabled title={`${action.label} (قريبًا)`}>
            <Plus className="size-4" aria-hidden="true" />
            {action.label}
          </Button>
        ) : null}
      </div>
    </header>
  );
}
