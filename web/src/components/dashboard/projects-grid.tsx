"use client";

import { useMemo, useState } from "react";

import { FilterChips } from "@/components/dashboard/filter-chips";
import { ProjectCard } from "@/components/dashboard/project-card";
import type { DeveloperProjectCard, ProjectFilterTab } from "@/types/dashboard";

export function ProjectsGrid({
  projects,
  filterTabs,
  basePath,
}: {
  projects: DeveloperProjectCard[];
  filterTabs: ProjectFilterTab[];
  basePath: string;
}) {
  const [active, setActive] = useState<ProjectFilterTab["key"]>("all");

  const filtered = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.status === active)),
    [projects, active],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">محفظة المشاريع</h2>
        <FilterChips items={filterTabs} active={active} onChange={setActive} />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 dash-sm:grid-cols-2 min-[1180px]:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} basePath={basePath} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-foreground/20 bg-surface px-6 py-16 text-center text-sm text-muted">
          لا توجد مشاريع مطابقة لهذا الفلتر.
        </div>
      )}
    </div>
  );
}
