import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { ProjectForm } from "@/components/dashboard/project-form";
import { updateProjectAction } from "@/lib/actions/update-project";
import { getDeveloperProjectById } from "@/lib/data/developer-projects";

export const metadata: Metadata = {
  title: "تعديل المشروع · لوحة تحكم المطوّر · مَعلم",
};

export default async function EditDeveloperProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getDeveloperProjectById(id);
  if (!project) notFound();

  return (
    <>
      <DeveloperTopbar eyebrow="محفظتك العقارية" title="تعديل المشروع" searchPlaceholder="بحث…" />
      <div className="px-8 py-7">
        <ProjectForm
          action={updateProjectAction}
          returnTo="/dashboard/developer/projects"
          project={{
            id: project.id,
            name: project.name,
            city: project.city,
            district: project.district,
            type: project.type,
            status: project.status,
            priceFromMillions: project.priceFromMillions,
            tag: project.tag,
            blurb: project.blurb,
            amenities: project.amenities,
            imageUrl: project.imageUrl,
          }}
        />
      </div>
    </>
  );
}
