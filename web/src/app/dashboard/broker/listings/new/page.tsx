import type { Metadata } from "next";

import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { UnitForm } from "@/components/dashboard/unit-form";
import { createUnitAction } from "@/lib/actions/create-unit";
import { getDeveloperProjectOptions } from "@/lib/data/developer-projects";

export const metadata: Metadata = {
  title: "قائمة جديدة · لوحة تحكم الوسيط · مَعلم",
};

export default async function NewBrokerListingPage() {
  const projectOptions = await getDeveloperProjectOptions();

  return (
    <>
      <DeveloperTopbar eyebrow="المحفظة" title="قائمة جديدة" searchPlaceholder="بحث…" />
      <div className="px-8 py-7">
        <UnitForm
          action={createUnitAction}
          returnTo="/dashboard/broker/listings"
          projectOptions={projectOptions}
        />
      </div>
    </>
  );
}
