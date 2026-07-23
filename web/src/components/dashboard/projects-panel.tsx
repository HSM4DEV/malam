"use client";

import { useMemo, useState } from "react";

import { FilterChips } from "@/components/dashboard/filter-chips";
import { ProjectRow } from "@/components/dashboard/project-row";
import { cn } from "@/lib/utils";
import type { ProjectFilterTab, ProjectRow as ProjectRowData } from "@/types/dashboard";

const COLUMN_TEMPLATE = "grid-cols-[2fr_1fr_1.3fr_1fr_1fr_40px]";

export function ProjectsPanel({
  projects,
  filterTabs,
}: {
  projects: ProjectRowData[];
  filterTabs: ProjectFilterTab[];
}) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilterTab["key"]>("all");

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? projects
        : projects.filter((project) => project.status === activeFilter),
    [projects, activeFilter],
  );

  return (
    <div className="animate-fade-up overflow-hidden rounded-2xl border border-foreground/9 bg-surface">
      <div className="flex items-center justify-between border-b border-foreground/9 px-[26px] py-[22px]">
        <div className="font-serif text-xl font-semibold">مشاريعي</div>
        <FilterChips items={filterTabs} active={activeFilter} onChange={setActiveFilter} />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div
            className={cn(
              "grid gap-4 border-b border-foreground/8 px-[26px] py-3.5 text-xs font-semibold text-muted",
              COLUMN_TEMPLATE,
            )}
          >
            <span>المشروع</span>
            <span>المدينة</span>
            <span>الوحدات المباعة</span>
            <span>المشاهدات</span>
            <span>الحالة</span>
            <span />
          </div>

          {filtered.length > 0 ? (
            filtered.map((project) => <ProjectRow key={project.id} project={project} />)
          ) : (
            <div className="px-[26px] py-14 text-center text-sm text-muted">
              لا توجد مشاريع مطابقة لهذا الفلتر.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
