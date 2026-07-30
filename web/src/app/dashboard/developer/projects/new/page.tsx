import type { Metadata } from "next";

import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { ProjectForm } from "@/components/dashboard/project-form";
import { createProjectAction } from "@/lib/actions/create-project";

export const metadata: Metadata = {
  title: "مشروع جديد · لوحة تحكم المطوّر · مَعلم",
};

export default function NewDeveloperProjectPage() {
  return (
    <>
      <DeveloperTopbar eyebrow="محفظتك العقارية" title="مشروع جديد" searchPlaceholder="بحث…" />
      <div className="px-8 py-7">
        <ProjectForm action={createProjectAction} returnTo="/dashboard/developer/projects" />
      </div>
    </>
  );
}
