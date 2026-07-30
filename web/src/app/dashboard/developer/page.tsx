import type { Metadata } from "next";

import { DeveloperTopbar } from "@/components/dashboard/developer-topbar";
import { LeadsList } from "@/components/dashboard/leads-list";
import { NextPhaseCta } from "@/components/dashboard/next-phase-cta";
import { ProjectsPanel } from "@/components/dashboard/projects-panel";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ViewsChart } from "@/components/dashboard/views-chart";
import { getDeveloperOverview } from "@/lib/data/developer-dashboard";

export const metadata: Metadata = {
  title: "نظرة عامة · لوحة تحكم المطوّر · مَعلم",
};

export default async function DeveloperOverviewPage() {
  const { kpis, chart, leads, filterTabs, projects } = await getDeveloperOverview();

  return (
    <>
      <DeveloperTopbar
        eyebrow="مرحباً بعودتك 👋"
        title="نظرة عامة"
        action={{ label: "مشروع جديد", href: "/dashboard/developer/projects/new" }}
      />

      <div className="flex flex-col gap-5 px-8 py-7">
        <StatsRow stats={kpis} />

        <div className="grid grid-cols-1 gap-5 dash:grid-cols-[1.5fr_1fr]">
          <ViewsChart chart={chart} />
          <LeadsList leads={leads} />
        </div>

        <ProjectsPanel projects={projects} filterTabs={filterTabs} basePath="/dashboard/developer/projects" />

        <NextPhaseCta newProjectHref="/dashboard/developer/projects/new" />
      </div>
    </>
  );
}
