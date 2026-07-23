"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { uniqueCompanySlug } from "@/lib/data/admin-applications";
import { sendAccountInviteEmail } from "@/lib/email/resend";

const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function approveApplicationAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string") throw new Error("Missing application id.");

  const inquiry = await prisma.inquiry.findUnique({ where: { id } });
  if (!inquiry || inquiry.type !== "DEVELOPER_APPLICATION" || inquiry.status !== "NEW") {
    throw new Error("This application has already been reviewed or doesn't exist.");
  }

  const companyName = inquiry.companyName ?? inquiry.name;
  const companyType = inquiry.companyType ?? "DEVELOPER";
  const slug = await uniqueCompanySlug(companyName);

  const company = await prisma.company.create({
    data: { name: companyName, slug, type: companyType },
  });

  // If this email already belongs to a user (e.g. they'd previously signed up
  // as a buyer), upgrade that account instead of trying to create a
  // duplicate — but never touch an existing password.
  await prisma.user.upsert({
    where: { email: inquiry.email },
    create: {
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      role: companyType,
      companyId: company.id,
    },
    update: {
      role: companyType,
      companyId: company.id,
    },
  });

  const token = randomUUID();
  await prisma.verificationToken.create({
    data: {
      identifier: inquiry.email,
      token,
      expires: new Date(Date.now() + INVITE_TOKEN_TTL_MS),
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  await sendAccountInviteEmail(inquiry.email, companyName, `${baseUrl}/reset-password?token=${token}`);

  await prisma.inquiry.update({ where: { id }, data: { status: "APPROVED" } });

  revalidatePath("/admin/applications");
}
