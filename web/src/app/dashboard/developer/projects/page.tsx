import type { Metadata } from "next";

import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { ProjectsGrid } from "@/components/dashboard/projects-grid";
import { StatsRow } from "@/components/dashboard/stats-row";
import { getDeveloperProjects } from "@/lib/data/developer-projects";

export const metadata: Metadata = {
  title: "مشاريعي · لوحة تحكم المطوّر · مَعلم",
};

export default async function DeveloperProjectsPage() {
  const { stats, filterTabs, projects } = await getDeveloperProjects();

  return (
    <>
      <DeveloperTopbar
        eyebrow="محفظتك العقارية"
        title="مشاريعي"
        searchPlaceholder="ابحث في المشاريع…"
        action={{ label: "مشروع جديد" }}
      />

      <div className="flex flex-col gap-6 px-8 py-7">
        <StatsRow stats={stats} />
        <ProjectsGrid projects={projects} filterTabs={filterTabs} />
      </div>
    </>
  );
}
