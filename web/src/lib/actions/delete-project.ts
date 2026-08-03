"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getDeveloperCompanyId } from "@/lib/data/company";

export async function deleteProjectAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    throw new Error("مشروع غير صالح.");
  }

  const companyId = await getDeveloperCompanyId();
  const project = await prisma.project.findFirst({
    where: { id, companyId },
    select: { slug: true, company: { select: { slug: true } } },
  });
  if (!project) {
    throw new Error("تعذّر العثور على هذا المشروع.");
  }

  const { count } = await prisma.project.deleteMany({ where: { id, companyId } });
  if (count === 0) {
    throw new Error("تعذّر العثور على هذا المشروع.");
  }

  revalidatePath("/dashboard/developer/projects");
  revalidatePath("/dashboard/broker/projects");
  // Public pages: cached (revalidate = 300) — refresh immediately so the
  // deletion doesn't wait out the window on the pages that surfaced it.
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath(`/developers/${project.company.slug}`);
}
