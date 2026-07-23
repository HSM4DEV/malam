"use client";

import { cn } from "@/lib/utils";

interface FilterChipsProps<T extends string> {
  items: ReadonlyArray<{ key: T; label: string }>;
  active: T;
  onChange: (key: T) => void;
  className?: string;
}

/** Solid-fill segmented chips — the design's filter pattern for tables/grids. */
export function FilterChips<T extends string>({
  items,
  active,
  onChange,
  className,
}: FilterChipsProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          aria-pressed={active === item.key}
          className={cn(
            "rounded-lg px-4 py-1.5 text-[12.5px] font-medium transition-colors",
            active === item.key
              ? "bg-primary font-semibold text-primary-foreground"
              : "text-muted-dark hover:bg-cream",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
