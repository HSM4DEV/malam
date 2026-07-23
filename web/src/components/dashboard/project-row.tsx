import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { toArabicDigits } from "@/lib/format";
import type { ProjectRow as ProjectRowData } from "@/types/dashboard";

const STATUS_LABEL: Record<ProjectRowData["status"], string> = {
  published: "منشور",
  review: "قيد المراجعة",
  draft: "مسوّدة",
};

const STATUS_VARIANT: Record<ProjectRowData["status"], "published" | "review" | "draft"> = {
  published: "published",
  review: "review",
  draft: "draft",
};

export function ProjectRow({ project }: { project: ProjectRowData }) {
  const isDraft = project.status === "draft";
  const soldLabel = isDraft
    ? "مسوّدة"
    : `${toArabicDigits(project.soldUnits)} / ${toArabicDigits(project.totalUnits)} وحدة`;
  const soldPct =
    !isDraft && project.totalUnits > 0
      ? Math.round((project.soldUnits / project.totalUnits) * 100)
      : 0;

  return (
    <button
      type="button"
      aria-disabled="true"
      title="عرض تفاصيل المشروع (قريبًا)"
      className="grid w-full grid-cols-[2fr_1fr_1.3fr_1fr_1fr_40px] items-center gap-4 border-b border-foreground/6 px-[26px] py-4 text-start transition-colors hover:bg-cream"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative size-11 shrink-0 overflow-hidden rounded-[10px] bg-sand">
          <Image
            src={`https://picsum.photos/seed/${project.imageSeed}/160/160.webp`}
            alt={project.imageAlt}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <span className="truncate text-[14.5px] font-semibold">{project.name}</span>
      </div>

      <span className="text-sm text-muted-strong">{project.city}</span>

      <div>
        <div className="mb-[5px] text-[13px] text-muted-strong">{soldLabel}</div>
        <div className="h-1.5 max-w-[120px] overflow-hidden rounded-full bg-sand">
          <div className="h-full rounded-full bg-pine" style={{ width: `${soldPct}%` }} />
        </div>
      </div>

      <span className="text-sm font-medium text-muted-strong">{project.viewsLabel}</span>

      <Badge variant={STATUS_VARIANT[project.status]}>{STATUS_LABEL[project.status]}</Badge>

      <span className="text-center text-lg text-muted-light">⋯</span>
    </button>
  );
}
