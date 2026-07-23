import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { getApplications } from "@/lib/data/admin-applications";
import { approveApplicationAction } from "@/lib/actions/approve-application";
import { rejectApplicationAction } from "@/lib/actions/reject-application";
import { formatRelativeArabic } from "@/lib/format";
import type { Inquiry } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "طلبات الانضمام — لوحة الإدارة" };
export const dynamic = "force-dynamic";

const COMPANY_TYPE_LABEL: Record<string, string> = {
  DEVELOPER: "مطوّر عقاري",
  BROKER: "وسيط عقاري",
};

const STATUS_BADGE: Record<string, { label: string; variant: "outline" | "success" | "clay" }> = {
  NEW: { label: "بانتظار المراجعة", variant: "outline" },
  APPROVED: { label: "تمت الموافقة", variant: "success" },
  REJECTED: { label: "مرفوض", variant: "clay" },
};

export default async function AdminApplicationsPage() {
  const applications = await getApplications();
  const pending = applications.filter((a) => a.status === "NEW");
  const reviewed = applications.filter((a) => a.status !== "NEW");

  return (
    <div>
      <h1 className="mb-1 font-serif text-3xl font-semibold">طلبات انضمام المطوّرين والوسطاء</h1>
      <p className="mb-9 text-sm text-muted-strong">
        الموافقة تُنشئ شركةً وحساباً، وترسل للمتقدّم رابط تعيين كلمة مرورٍ عبر البريد.
      </p>

      <section>
        <h2 className="mb-4 text-sm font-bold text-muted-dark">
          بانتظار المراجعة ({pending.length.toLocaleString("ar-EG")})
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-2xl border border-foreground/10 bg-surface px-6 py-10 text-center text-sm text-muted">
            لا طلبات بانتظار المراجعة.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {pending.map((app) => (
              <ApplicationCard key={app.id} app={app} actionable />
            ))}
          </div>
        )}
      </section>

      {reviewed.length > 0 ? (
        <section className="mt-11">
          <h2 className="mb-4 text-sm font-bold text-muted-dark">تمّت مراجعتها مؤخّراً</h2>
          <div className="flex flex-col gap-4">
            {reviewed.map((app) => (
              <ApplicationCard key={app.id} app={app} actionable={false} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ApplicationCard({ app, actionable }: { app: Inquiry; actionable: boolean }) {
  const badge = STATUS_BADGE[app.status] ?? STATUS_BADGE.NEW;

  return (
    <div className="rounded-2xl border border-foreground/10 bg-surface px-6 py-5.5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-serif text-xl font-semibold">{app.companyName}</h3>
            <span className="text-xs text-muted">
              {app.companyType ? COMPANY_TYPE_LABEL[app.companyType] : "غير محدّد"}
            </span>
          </div>
          <div className="mt-1 text-[13px] text-muted-strong">
            {app.name} · {app.email} · {app.phone}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={badge.variant}>{badge.label}</Badge>
          <span className="text-xs text-muted">{formatRelativeArabic(app.createdAt)}</span>
        </div>
      </div>

      <p className="mb-4 text-sm leading-[1.75] font-light text-muted-strong">{app.message}</p>

      {actionable ? (
        <div className="flex gap-2.5">
          <form action={approveApplicationAction}>
            <input type="hidden" name="id" value={app.id} />
            <button
              type="submit"
              className="rounded-[10px] bg-pine px-5 py-2.5 text-[13px] font-semibold text-cream transition-colors hover:bg-pine-dark"
            >
              الموافقة وإنشاء الحساب
            </button>
          </form>
          <form action={rejectApplicationAction}>
            <input type="hidden" name="id" value={app.id} />
            <button
              type="submit"
              className="rounded-[10px] border border-foreground/15 px-5 py-2.5 text-[13px] font-semibold text-muted-strong transition-colors hover:border-clay hover:text-clay"
            >
              رفض
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
