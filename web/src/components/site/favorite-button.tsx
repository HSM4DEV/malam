"use client";

import { Heart } from "lucide-react";

export function FavoriteButton({
  active,
  onToggle,
  variant = "grid",
}: {
  active: boolean;
  onToggle: () => void;
  variant?: "grid" | "list";
}) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  }

  if (variant === "list") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center gap-1.5 bg-transparent text-[13px] font-semibold transition-colors ${
          active ? "text-pine" : "text-muted"
        }`}
      >
        <Heart className="size-4" fill={active ? "currentColor" : "none"} aria-hidden="true" />
        حفظ
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      className={`absolute start-3 top-3 flex size-[38px] items-center justify-center rounded-full backdrop-blur-md transition-transform active:scale-90 ${
        active ? "bg-pine text-cream" : "bg-surface/90 text-pine"
      }`}
    >
      <Heart className="size-4" fill={active ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
