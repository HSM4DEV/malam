"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, onCheckedChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-pine" : "bg-sand",
      )}
    >
      {/* Logical inset so the thumb slides toward the end (left in RTL) when on. */}
      <span
        className="absolute top-1/2 size-[18px] -translate-y-1/2 rounded-full bg-surface shadow-sm transition-[inset-inline-start]"
        style={{ insetInlineStart: checked ? "20px" : "3px" }}
      />
    </button>
  );
}
