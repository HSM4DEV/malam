import type { Metadata } from "next";
import { Download } from "lucide-react";

import { getNewsletterSubscribers } from "@/lib/data/admin-subscribers";
import { formatRelativeArabic, toArabicDigits } from "@/lib/format";

export const metadata: Metadata = { title: "مشتركو النشرة — لوحة الإدارة" };
export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subscribers = await getNewsletterSubscribers();

  return (
    <div>
      <div className="mb-9 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 font-serif text-3xl font-semibold">مشتركو النشرة البريدية</h1>
          <p className="text-sm text-muted-strong">
            {toArabicDigits(subscribers.length)} مشترك — من صفحة المدوّنة.
          </p>
        </div>
        {subscribers.length > 0 ? (
          <a
            href="/admin/subscribers/export"
            className="flex items-center gap-2 rounded-[10px] border border-foreground/15 px-5 py-2.5 text-[13px] font-semibold text-muted-strong transition-colors hover:border-pine hover:text-pine"
          >
            <Download className="size-4" aria-hidden="true" />
            تصدير CSV
          </a>
        ) : null}
      </div>

      {subscribers.length === 0 ? (
        <p className="rounded-2xl border border-foreground/10 bg-surface px-6 py-10 text-center text-sm text-muted">
          لا يوجد مشتركون بعد.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-foreground/9 px-6 py-3.5 text-xs font-semibold text-muted">
            <span>البريد الإلكتروني</span>
            <span>تاريخ الاشتراك</span>
          </div>
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-foreground/6 px-6 py-3.5 text-sm last:border-b-0"
            >
              <span dir="ltr" className="truncate font-medium">
                {subscriber.email}
              </span>
              <span className="shrink-0 text-xs text-muted">
                {formatRelativeArabic(subscriber.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
