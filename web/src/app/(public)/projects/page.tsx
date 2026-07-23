import type { Metadata } from "next";

import { toArabicDigits } from "@/lib/format";
import { ProjectsFilterBar } from "@/components/site/projects-filter-bar";
import { ProjectsResults } from "@/components/site/projects-results";
import { getPublicCities, getPublicProjects } from "@/lib/data/public-projects";
import type { PublicProjectFilters } from "@/types/public";

export const metadata: Metadata = { title: "المساكن — مَعلم" };

// Filtered by live searchParams against Postgres — never prerender.
export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  city?: string;
  type?: string;
  minBeds?: string;
  maxPrice?: string;
  sort?: string;
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filters: PublicProjectFilters = {
    q: params.q || undefined,
    city: params.city || undefined,
    type: params.type || undefined,
    minBeds: params.minBeds ? Number(params.minBeds) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    sort:
      params.sort === "price-asc" || params.sort === "price-desc" ? params.sort : "newest",
  };

  const [projects, cities] = await Promise.all([getPublicProjects(filters), getPublicCities()]);

  return (
    <div dir="rtl">
      <header className="mx-auto max-w-[1320px] px-5 pt-14 pb-5 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-3 text-[12.5px] font-bold tracking-wide text-pine">اكتشف المساكن</div>
            <h1 className="max-w-[18ch] font-serif text-[clamp(30px,4.6vw,60px)] leading-[1.08] font-semibold">
              محفظةٌ منسّقةٌ من أرقى العناوين في المملكة
            </h1>
          </div>
          <div className="text-[15px] text-muted-dark">
            <span className="font-serif text-2xl font-semibold text-pine">
              {toArabicDigits(projects.length)}
            </span>{" "}
            مسكناً متاحاً
          </div>
        </div>
      </header>

      <ProjectsFilterBar cities={cities} />

      <section className="mx-auto max-w-[1320px] px-5 py-8 pb-20 sm:px-10">
        <ProjectsResults projects={projects} />
      </section>
    </div>
  );
}
