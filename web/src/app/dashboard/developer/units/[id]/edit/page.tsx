import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { UnitForm } from "@/components/dashboard/unit-form";
import { updateUnitAction } from "@/lib/actions/update-unit";
import { getDeveloperUnitById } from "@/lib/data/developer-units";

export const metadata: Metadata = {
  title: "تعديل الوحدة · لوحة تحكم المطوّر · مَعلم",
};

export default async function EditDeveloperUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const unit = await getDeveloperUnitById(id);
  if (!unit) notFound();

  return (
    <>
      <DeveloperTopbar eyebrow="المخزون" title="تعديل الوحدة" searchPlaceholder="بحث…" />
      <div className="px-8 py-7">
        <UnitForm
          action={updateUnitAction}
          returnTo="/dashboard/developer/units"
          projectOptions={[]}
          unit={{
            id: unit.id,
            projectId: unit.projectId,
            projectName: unit.project.name,
            code: unit.code,
            typeName: unit.typeName,
            areaSqm: unit.areaSqm,
            floorLabel: unit.floorLabel,
            beds: unit.beds,
            baths: unit.baths,
            priceMillions: unit.priceMillions,
            status: unit.status,
            imageUrl: unit.imageUrl,
          }}
        />
      </div>
    </>
  );
}
