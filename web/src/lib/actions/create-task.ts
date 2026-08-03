"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getDeveloperCompanyId } from "@/lib/data/company";
import { taskSchema, type TaskFormState } from "@/lib/validation/task";

export async function createTaskAction(
  _prev: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    dueLabel: formData.get("dueLabel"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة" };
  }

  const companyId = await getDeveloperCompanyId();
  await prisma.task.create({
    data: {
      companyId,
      title: parsed.data.title,
      dueLabel: parsed.data.dueLabel,
    },
  });

  revalidatePath("/dashboard/broker");
  return {};
}
