import type { Metadata } from "next";

import { DealPipelineBoard } from "@/components/dashboard/deal-pipeline-board";
import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { getBrokerDeals } from "@/lib/data/broker-deals";

export const metadata: Metadata = {
  title: "الصفقات · لوحة تحكم الوسيط · مَعلم",
};

export default async function BrokerDealsPage() {
  const { columns } = await getBrokerDeals();

  return (
    <>
      <DeveloperTopbar
        eyebrow="مسار الصفقات"
        title="الصفقات"
        searchPlaceholder="ابحث في الصفقات…"
      />

      <div className="px-8 py-7">
        <DealPipelineBoard columns={columns} />
      </div>
    </>
  );
}
