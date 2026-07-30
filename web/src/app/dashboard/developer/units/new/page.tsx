import type { Metadata } from "next";

import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { UnitForm } from "@/components/dashboard/unit-form";
import { createUnitAction } from "@/lib/actions/create-unit";
import { getDeveloperProjectOptions } from "@/lib/data/developer-projects";

export const metadata: Metadata = {
  title: "وحدة جديدة · لوحة تحكم المطوّر · مَعلم",
};

export default async function NewDeveloperUnitPage() {
  const projectOptions = await getDeveloperProjectOptions();

  return (
    <>
      <DeveloperTopbar eyebrow="المخزون" title="وحدة جديدة" searchPlaceholder="بحث…" />
      <div className="px-8 py-7">
        <UnitForm
          action={createUnitAction}
          returnTo="/dashboard/developer/units"
          projectOptions={projectOptions}
        />
      </div>
    </>
  );
}
