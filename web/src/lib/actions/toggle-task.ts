"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getDeveloperCompanyId } from "@/lib/data/company";

export async function toggleTaskAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  const completed = formData.get("completed");
  if (typeof id !== "string" || !id || typeof completed !== "string") {
    throw new Error("مهمة غير صالحة.");
  }

  const companyId = await getDeveloperCompanyId();
  const { count } = await prisma.task.updateMany({
    where: { id, companyId },
    data: { completed: completed === "true" },
  });
  if (count === 0) {
    throw new Error("تعذّر العثور على هذه المهمة.");
  }

  revalidatePath("/dashboard/broker");
}
