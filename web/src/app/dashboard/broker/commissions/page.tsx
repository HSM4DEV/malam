import type { Metadata } from "next";
import { Coins } from "lucide-react";

import { ComingSoonCard } from "@/components/dashboard/coming-soon-card";
import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";

export const metadata: Metadata = {
  title: "العمولات · لوحة تحكم الوسيط · مَعلم",
};

export default function BrokerCommissionsPage() {
  return (
    <>
      <DeveloperTopbar eyebrow="الأرباح" title="العمولات" searchPlaceholder="بحث…" />

      <div className="px-8 py-7">
        <ComingSoonCard
          icon={Coins}
          title="تتبّع العمولات قريبًا"
          description="سنعرض هنا عمولاتك المحسوبة تلقائيًا من الصفقات المُغلقة، بمجرد ربط قيمة كل صفقة."
          ctaLabel="عرض التقرير"
        />
      </div>
    </>
  );
}
