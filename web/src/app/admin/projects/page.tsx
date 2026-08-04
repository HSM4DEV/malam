import Link from "next/link";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { getAllProjectsForModeration, type AdminProjectRow } from "@/lib/data/admin-projects";
import { adminUpdateProjectStatusAction } from "@/lib/actions/admin-update-project-status";
import { formatMillions, formatRelativeArabic } from "@/lib/format";
import type { ProjectStatus } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "المشاريع — لوحة الإدارة" };
export const dynamic = "force-dynamic";

const STATUS_TABS: Array<{ key: ProjectStatus | "ALL"; label: string }> = [
  { key: "ALL", label: "الكل" },
  { key: "PUBLISHED", label: "منشور" },
  { key: "IN_REVIEW", label: "قيد المراجعة" },
  { key: "DRAFT", label: "مسوّدة" },
];

const STATUS_BADGE: Record<ProjectStatus, { label: string; variant: "published" | "review" | "draft" }> = {
  PUBLISHED: { label: "منشور", variant: "published" },
  IN_REVIEW: { label: "قيد المراجعة", variant: "review" },
  DRAFT: { label: "مسوّدة", variant: "draft" },
};

const COMPANY_TYPE_LABEL: Record<string, string> = {
  DEVELOPER: "مطوّر عقاري",
  BROKER: "وسيط عقاري",
};

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const status =
    statusParam === "DRAFT" || statusParam === "IN_REVIEW" || statusParam === "PUBLISHED"
      ? statusParam
      : undefined;
  const projects = await getAllProjectsForModeration(status);

  return (
    <div>
      <h1 className="mb-1 font-serif text-3xl font-semibold">إشراف المشاريع</h1>
      <p className="mb-6 text-sm text-muted-strong">
        كل المشاريع عبر جميع الشركات — يمكن تغيير حالة أي مشروعٍ من هنا بغضّ النظر عن الشركة المالكة.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === "ALL" ? "/admin/projects" : `/admin/projects?status=${tab.key}`}
            className={`rounded-full px-4.5 py-2 text-[13px] font-medium transition-colors ${
              (tab.key === "ALL" && !status) || tab.key === status
                ? "border border-pine bg-pine text-cream"
                : "border border-foreground/15 text-muted-strong hover:border-pine hover:text-pine"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {projects.length === 0 ? (
        <p className="rounded-2xl border border-foreground/10 bg-surface px-6 py-10 text-center text-sm text-muted">
          لا مشاريع مطابقة.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectRow({ project }: { project: AdminProjectRow }) {
  const badge = STATUS_BADGE[project.status];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-surface px-6 py-4.5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="font-serif text-lg font-semibold">{project.name}</h3>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
        <div className="mt-1 text-[13px] text-muted-strong">
          {project.company.name} · {COMPANY_TYPE_LABEL[project.company.type] ?? project.company.type} ·{" "}
          {project.city} · حيّ {project.district}
        </div>
        <div className="mt-1 text-xs text-muted">
          يبدأ من {formatMillions(project.priceFromMillions)} ريال · أُنشئ{" "}
          {formatRelativeArabic(project.createdAt)}
        </div>
      </div>

      <form action={adminUpdateProjectStatusAction} className="flex items-center gap-2">
        <input type="hidden" name="id" value={project.id} />
        <select
          name="status"
          defaultValue={project.status}
          className="h-9 rounded-[10px] border border-foreground/14 bg-surface px-3 text-[13px] text-foreground outline-none focus:border-pine"
        >
          <option value="DRAFT">مسوّدة</option>
          <option value="IN_REVIEW">قيد المراجعة</option>
          <option value="PUBLISHED">منشور</option>
        </select>
        <button
          type="submit"
          className="h-9 rounded-[10px] bg-pine px-4 text-[13px] font-semibold text-cream transition-colors hover:bg-pine-dark"
        >
          تحديث
        </button>
      </form>
    </div>
  );
}
