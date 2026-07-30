import type { Metadata } from "next";
import Link from "next/link";
import { ListChecks } from "lucide-react";

import { ComingSoonCard } from "@/components/dashboard/coming-soon-card";
import { DealPipelineBoard } from "@/components/dashboard/deal-pipeline-board";
import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { ListingsPreview } from "@/components/dashboard/listings-preview";
import { StatsRow } from "@/components/dashboard/stats-row";
import { getBrokerOverview } from "@/lib/data/broker-dashboard";

export const metadata: Metadata = {
  title: "نظرة عامة · لوحة تحكم الوسيط · مَعلم",
};

export default async function BrokerOverviewPage() {
  const { kpis, pipeline, listings } = await getBrokerOverview();

  return (
    <>
      <DeveloperTopbar eyebrow="صباح الخير 👋" title="لوحة الوسيط" />

      <div className="flex flex-col gap-5 px-8 py-7">
        <StatsRow stats={kpis} />

        <div className="animate-fade-up rounded-2xl border border-foreground/9 bg-surface px-[26px] py-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="font-serif text-xl font-semibold">مسار الصفقات</div>
            <Link
              href="/dashboard/broker/deals"
              className="text-sm font-semibold text-pine hover:underline"
            >
              إدارة المسار
            </Link>
          </div>
          <DealPipelineBoard columns={pipeline} />
        </div>

        <div className="grid grid-cols-1 gap-5 dash:grid-cols-[1.4fr_1fr]">
          <ListingsPreview units={listings} />
          <ComingSoonCard
            icon={ListChecks}
            title="مهام اليوم قريبًا"
            description="سنتيح هنا قريبًا إضافة مهامّك اليومية ومتابعتها من نفس اللوحة."
            ctaLabel="إضافة مهمة"
          />
        </div>
      </div>
    </>
  );
}
