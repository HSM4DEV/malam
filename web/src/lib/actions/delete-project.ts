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
  const { count } = await prisma.project.deleteMany({ where: { id, companyId } });
  if (count === 0) {
    throw new Error("تعذّر العثور على هذا المشروع.");
  }

  revalidatePath("/dashboard/developer/projects");
  revalidatePath("/dashboard/broker/projects");
}
