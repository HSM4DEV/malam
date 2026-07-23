"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // user cancelled or share failed — fall back to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing more we can do
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-[11px] border border-foreground/18 px-4.5 py-2.5 text-[13.5px] font-semibold text-foreground transition-colors hover:border-pine"
    >
      {copied ? (
        <>
          <Check className="size-4" aria-hidden="true" />
          تم النسخ
        </>
      ) : (
        <>
          <Share2 className="size-4" aria-hidden="true" />
          مشاركة
        </>
      )}
    </button>
  );
}
