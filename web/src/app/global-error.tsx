"use client";

import { useEffect } from "react";
import { IBM_Plex_Sans_Arabic } from "next/font/google";

import { logClientError } from "@/lib/actions/log-client-error";
import "./globals.css";

// global-error.tsx replaces the root layout entirely when it fires, so it
// can't inherit src/app/layout.tsx's <html>/<body> — it has to redeclare
// the same font setup and bg/text tokens itself.
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-sans-ar",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void logClientError("global-error", error.message, { digest: error.digest, stack: error.stack });
  }, [error]);

  return (
    <html lang="ar" dir="rtl" className={ibmPlexSansArabic.variable}>
      <body className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-foreground antialiased">
        <div>
          <h1 className="mb-3 text-[26px] font-semibold">حدث خطأ غير متوقع</h1>
          <p className="mx-auto mb-6 max-w-[40ch] text-sm text-muted-strong">
            نعتذر عن الإزعاج. حاول تحديث الصفحة، وإذا استمرت المشكلة تواصل معنا.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-[11px] bg-pine px-6 py-2.5 text-sm font-semibold text-cream"
          >
            حاول مرة أخرى
          </button>
        </div>
      </body>
    </html>
  );
}
