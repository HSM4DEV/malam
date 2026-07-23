import Image from "next/image";
import { Eye, MessageSquareText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SaudiRiyal } from "@/components/ui/saudi-riyal";
import { toArabicDigits } from "@/lib/format";
import type { DeveloperProjectCard, ProjectStatus } from "@/types/dashboard";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  published: "منشور",
  review: "قيد المراجعة",
  draft: "مسوّدة",
};

export function ProjectCard({ project }: { project: DeveloperProjectCard }) {
  const isDraft = project.status === "draft";
  const soldPct =
    !isDraft && project.totalUnits > 0
      ? Math.round((project.soldUnits / project.totalUnits) * 100)
      : 0;

  return (
    <button
      type="button"
      aria-disabled="true"
      title="عرض تفاصيل المشروع (قريبًا)"
      className="pcard group block overflow-hidden rounded-2xl border border-foreground/9 bg-surface text-start"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="pthumb absolute inset-0">
          <Image
            src={`https://picsum.photos/seed/${project.imageSeed}/800/600.webp`}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 960px) 100vw, 400px"
            className="object-cover"
          />
        </div>
        <span className="absolute end-3.5 top-3.5 rounded-full bg-cream/95 px-3 py-1.5 text-[11px] font-bold text-pine backdrop-blur-sm">
          {project.tag}
        </span>
      </div>

      <div className="p-[22px]">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold text-muted">
            {project.cityLabel}
          </span>
          <Badge variant={project.status === "review" ? "review" : project.status === "draft" ? "draft" : "published"}>
            {STATUS_LABEL[project.status]}
          </Badge>
        </div>

        <h3 className="mb-3 font-serif text-[23px] leading-tight font-semibold">
          {project.name}
        </h3>

        <div className="mb-4 flex items-center gap-2.5 border-b border-foreground/9 pb-4 text-[13px] text-muted-strong">
          <span>{project.type}</span>
          <span className="text-sand">·</span>
          <span className="font-serif text-base font-semibold text-pine">
            {project.priceLabel}
            <SaudiRiyal />
          </span>
        </div>

        {isDraft ? (
          <div className="text-[12.5px] text-muted">لم تُنشر بعد — أكمل التفاصيل للنشر.</div>
        ) : (
          <>
            <div className="mb-1 flex items-center justify-between text-[12.5px] text-muted-strong">
              <span>
                {toArabicDigits(project.soldUnits)} / {toArabicDigits(project.totalUnits)} وحدة مباعة
              </span>
              <span className="font-semibold text-pine">{toArabicDigits(soldPct)}٪</span>
            </div>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-sand">
              <div className="h-full rounded-full bg-pine" style={{ width: `${soldPct}%` }} />
            </div>
            <div className="flex items-center gap-4 text-[12.5px] text-muted">
              <span className="flex items-center gap-1.5">
                <Eye className="size-3.5" aria-hidden="true" />
                {project.viewsLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquareText className="size-3.5" aria-hidden="true" />
                {toArabicDigits(project.leadsCount)} طلب
              </span>
            </div>
          </>
        )}
      </div>
    </button>
  );
}
