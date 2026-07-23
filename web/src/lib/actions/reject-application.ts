"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function rejectApplicationAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string") throw new Error("Missing application id.");

  const inquiry = await prisma.inquiry.findUnique({ where: { id } });
  if (!inquiry || inquiry.type !== "DEVELOPER_APPLICATION" || inquiry.status !== "NEW") {
    throw new Error("This application has already been reviewed or doesn't exist.");
  }

  await prisma.inquiry.update({ where: { id }, data: { status: "REJECTED" } });

  revalidatePath("/admin/applications");
}
