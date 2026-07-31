"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { logClientError } from "@/lib/actions/log-client-error";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void logClientError("dashboard-error-boundary", error.message, {
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-3 font-serif text-[32px] font-semibold">حدث خطأ غير متوقع</h1>
      <p className="mx-auto mb-7 max-w-[42ch] text-sm text-muted-strong">
        تعذّر تحميل لوحة التحكم. حاول مرة أخرى، وإذا استمرت المشكلة تواصل معنا.
      </p>
      <div className="flex items-center gap-3">
        <Button type="button" onClick={reset}>
          حاول مرة أخرى
        </Button>
        <Button asChild variant="outline">
          <Link href="/">العودة للرئيسية</Link>
        </Button>
      </div>
    </div>
  );
}
