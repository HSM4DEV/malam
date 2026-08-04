"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { ProjectStatus } from "@/generated/prisma/client";

const VALID_STATUSES: ProjectStatus[] = ["DRAFT", "IN_REVIEW", "PUBLISHED"];

/**
 * Admin-only: overrides a project's status regardless of which company owns
 * it — unlike every other project action in this app, this one is
 * deliberately not scoped to a companyId. Gated entirely by src/proxy.ts's
 * /admin/:path* → role === "ADMIN" check.
 */
export async function adminUpdateProjectStatusAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  const status = formData.get("status");
  if (typeof id !== "string" || !id) {
    throw new Error("مشروع غير صالح.");
  }
  if (typeof status !== "string" || !VALID_STATUSES.includes(status as ProjectStatus)) {
    throw new Error("حالة غير صالحة.");
  }

  const project = await prisma.project.findUnique({
    where: { id },
    select: { slug: true, company: { select: { slug: true } } },
  });
  if (!project) {
    throw new Error("تعذّر العثور على هذا المشروع.");
  }

  await prisma.project.update({
    where: { id },
    data: { status: status as ProjectStatus },
  });

  revalidatePath("/admin/projects");
  // Public pages: cached (revalidate = 300) — refresh immediately so a
  // moderation decision doesn't wait out the window.
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath(`/developers/${project.company.slug}`);
}
