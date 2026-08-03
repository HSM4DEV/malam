import type { Metadata } from "next";

import { CommissionsPanel } from "@/components/dashboard/commissions-panel";
import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { getBrokerCommissions } from "@/lib/data/broker-commissions";

export const metadata: Metadata = {
  title: "العمولات · لوحة تحكم الوسيط · مَعلم",
};

export default async function BrokerCommissionsPage() {
  const { ratePercent, totalLabel, deals } = await getBrokerCommissions();

  return (
    <>
      <DeveloperTopbar eyebrow="الأرباح" title="العمولات" searchPlaceholder="بحث…" />

      <div className="px-8 py-7">
        <CommissionsPanel ratePercent={ratePercent} totalLabel={totalLabel} deals={deals} />
      </div>
    </>
  );
}
