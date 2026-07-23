"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, List, Home } from "lucide-react";

import { PublicProjectCardView } from "@/components/site/public-project-card";
import { ProjectCardList } from "@/components/site/project-card-list";
import { FavoriteButton } from "@/components/site/favorite-button";
import type { PublicProjectListItem } from "@/types/public";

const FAVORITES_KEY = "malam_favs";

export function ProjectsResults({ projects }: { projects: PublicProjectListItem[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [savedOnly, setSavedOnly] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Reading localStorage only after mount (not in a lazy useState initializer)
    // is intentional: the server has no localStorage, so starting empty on both
    // server and first client render avoids a hydration mismatch.
    try {
      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "{}");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFavorites(stored);
    } catch {
      // ignore malformed localStorage content
    }
  }, []);

  function toggleFavorite(slug: string) {
    setFavorites((prev) => {
      const next = { ...prev, [slug]: !prev[slug] };
      if (!next[slug]) delete next[slug];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable — favorites just won't persist
      }
      return next;
    });
  }

  const savedCount = Object.keys(favorites).length;
  const visible = savedOnly ? projects.filter((p) => favorites[p.slug]) : projects;

  return (
    <div>
      <div className="mb-7 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setSavedOnly((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors ${
            savedOnly ? "border border-pine bg-sage text-pine" : "border border-foreground/15 text-pine"
          }`}
        >
          ♡ المحفوظة ({savedCount.toLocaleString("ar-EG")})
        </button>

        <div className="flex gap-0.5 rounded-[11px] bg-sand p-1">
          <button
            type="button"
            title="شبكة"
            onClick={() => setView("grid")}
            className={`flex h-[34px] w-[38px] items-center justify-center rounded-[8px] transition-colors ${
              view === "grid" ? "bg-surface text-pine shadow-sm" : "text-muted"
            }`}
          >
            <LayoutGrid className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            title="قائمة"
            onClick={() => setView("list")}
            className={`flex h-[34px] w-[38px] items-center justify-center rounded-[8px] transition-colors ${
              view === "list" ? "bg-surface text-pine shadow-sm" : "text-muted"
            }`}
          >
            <List className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-[20px] border border-foreground/10 bg-surface px-5 py-20 text-center">
          <div className="mx-auto mb-4.5 flex size-[60px] items-center justify-center rounded-full bg-sage text-pine">
            <Home className="size-6" aria-hidden="true" />
          </div>
          <div className="mb-2 font-serif text-[26px] font-semibold">لا مساكن مطابقة</div>
          <p className="mx-auto mb-5 max-w-[34ch] text-[15px] font-light text-muted-strong">
            جرّب توسيع نطاق البحث أو مسح بعض عوامل التصفية.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <PublicProjectCardView
              key={project.slug}
              project={project}
              overlay={
                <FavoriteButton
                  active={Boolean(favorites[project.slug])}
                  onToggle={() => toggleFavorite(project.slug)}
                />
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((project) => (
            <ProjectCardList
              key={project.slug}
              project={project}
              favorite={Boolean(favorites[project.slug])}
              onToggleFavorite={() => toggleFavorite(project.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
