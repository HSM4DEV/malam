"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getDeveloperCompanyId } from "@/lib/data/company";

export async function deleteTaskAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    throw new Error("مهمة غير صالحة.");
  }

  const companyId = await getDeveloperCompanyId();
  const { count } = await prisma.task.deleteMany({ where: { id, companyId } });
  if (count === 0) {
    throw new Error("تعذّر العثور على هذه المهمة.");
  }

  revalidatePath("/dashboard/broker");
}
