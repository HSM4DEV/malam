import Link from "next/link";
import type { Metadata } from "next";

import { getPlatformOverview } from "@/lib/data/admin-overview";
import { toArabicDigits } from "@/lib/format";

export const metadata: Metadata = { title: "نظرة عامة — لوحة الإدارة" };
export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = {
  BUYER: "مشترٍ",
  DEVELOPER: "مطوّر",
  BROKER: "وسيط",
  ADMIN: "مدير",
};

const COMPANY_TYPE_LABEL: Record<string, string> = {
  DEVELOPER: "مطوّر عقاري",
  BROKER: "وسيط عقاري",
};

const PROJECT_STATUS_LABEL: Record<string, string> = {
  DRAFT: "مسوّدة",
  IN_REVIEW: "قيد المراجعة",
  PUBLISHED: "منشور",
};

const LEAD_STAGE_LABEL: Record<string, string> = {
  NEW: "جديد",
  CONTACTED: "تم التواصل",
  VIEWING: "معاينة",
  NEGOTIATING: "تفاوض",
  WON: "مغلقة (نجاح)",
  LOST: "مغلقة (خسارة)",
};

export default async function AdminOverviewPage() {
  const overview = await getPlatformOverview();

  return (
    <div>
      <h1 className="mb-1 font-serif text-3xl font-semibold">نظرة عامة على المنصّة</h1>
      <p className="mb-9 text-sm text-muted-strong">إحصاءاتٌ حيّة عبر جميع الشركات والمستخدمين.</p>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="المستخدمون" value={overview.totalUsers} />
        <StatCard label="الشركات" value={overview.totalCompanies} />
        <StatCard label="المشاريع" value={overview.totalProjects} />
        <StatCard label="العملاء المحتملون" value={overview.totalLeads} />
        <StatCard label="مشتركو النشرة" value={overview.subscriberCount} />
        <Link href="/admin/applications" className="block">
          <StatCard label="طلبات بانتظار المراجعة" value={overview.pendingApplicationsCount} highlight />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <BreakdownCard title="المستخدمون حسب الدور" counts={overview.usersByRole} labels={ROLE_LABEL} />
        <BreakdownCard title="الشركات حسب النوع" counts={overview.companiesByType} labels={COMPANY_TYPE_LABEL} />
        <BreakdownCard
          title="المشاريع حسب الحالة"
          counts={overview.projectsByStatus}
          labels={PROJECT_STATUS_LABEL}
        />
        <BreakdownCard title="العملاء المحتملون حسب المرحلة" counts={overview.leadsByStage} labels={LEAD_STAGE_LABEL} />
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border px-6 py-5 ${
        highlight ? "border-pine/30 bg-sage" : "border-foreground/9 bg-surface"
      }`}
    >
      <div className="mb-2 text-[13px] text-muted-dark">{label}</div>
      <div className="font-serif text-[32px] leading-none font-semibold text-pine">
        {toArabicDigits(value)}
      </div>
    </div>
  );
}

function BreakdownCard({
  title,
  counts,
  labels,
}: {
  title: string;
  counts: Partial<Record<string, number>>;
  labels: Record<string, string>;
}) {
  const entries = Object.entries(counts).filter(([, v]) => (v ?? 0) > 0);

  return (
    <div className="rounded-2xl border border-foreground/9 bg-surface px-6 py-5">
      <div className="mb-4 text-sm font-bold text-muted-dark">{title}</div>
      {entries.length === 0 ? (
        <p className="text-sm text-muted">لا بيانات بعد.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {entries.map(([key, count]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-muted-strong">{labels[key] ?? key}</span>
              <span className="font-semibold text-foreground">{toArabicDigits(count ?? 0)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
