"use client";

import { useMemo, useState } from "react";

import { PublicProjectCardView } from "@/components/site/public-project-card";
import type { PublicProjectCard } from "@/types/public";

export function FeaturedProjects({ projects }: { projects: PublicProjectCard[] }) {
  const cities = useMemo(
    () => ["الكل", ...Array.from(new Set(projects.map((p) => p.city)))],
    [projects],
  );
  const [city, setCity] = useState("الكل");
  const visible = city === "الكل" ? projects : projects.filter((p) => p.city === city);

  return (
    <div>
      <div className="mb-9 flex flex-wrap gap-2.5">
        {cities.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCity(c)}
            className={`rounded-full px-5 py-2.5 text-[13.5px] transition-colors ${
              c === city
                ? "border border-pine bg-pine font-semibold text-cream"
                : "border border-foreground/15 text-muted-strong hover:border-pine hover:text-pine"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-muted">لا توجد مساكن في هذه المدينة حالياً.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <PublicProjectCardView key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
