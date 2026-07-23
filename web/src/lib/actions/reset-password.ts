"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { resetPasswordSchema } from "@/lib/validation/auth";

export interface ResetPasswordState {
  error?: string;
}

export async function resetPasswordAction(
  _prev: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة" };
  }
  const { token, password } = parsed.data;

  const verificationToken = await prisma.verificationToken.findUnique({ where: { token } });
  if (!verificationToken || verificationToken.expires < new Date()) {
    return { error: "انتهت صلاحية الرابط أو أنه غير صحيح. اطلب رابطاً جديداً." };
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { passwordHash },
  });
  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: verificationToken.identifier, token } },
  });

  redirect("/login?reset=success");
}
