"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const FAVORITES_KEY = "malam_favs";

export function SaveProjectButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "{}");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: server has no localStorage, so both first renders start empty
      setSaved(Boolean(stored[slug]));
    } catch {
      // ignore malformed localStorage content
    }
  }, [slug]);

  function toggle() {
    setSaved((prev) => {
      const next = !prev;
      try {
        const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "{}");
        if (next) stored[slug] = true;
        else delete stored[slug];
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(stored));
      } catch {
        // localStorage unavailable — favorite just won't persist
      }
      return next;
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-[11px] px-4.5 py-2.5 text-[13.5px] font-semibold transition-colors ${
        saved ? "border border-pine bg-sage text-pine" : "border border-foreground/18 text-foreground"
      }`}
    >
      <Heart className="size-4" fill={saved ? "currentColor" : "none"} aria-hidden="true" />
      {saved ? "محفوظ" : "حفظ"}
    </button>
  );
}
