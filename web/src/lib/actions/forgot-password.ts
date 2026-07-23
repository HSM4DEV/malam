"use server";

import { randomUUID } from "node:crypto";

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email/resend";
import { forgotPasswordSchema } from "@/lib/validation/auth";

export interface ForgotPasswordState {
  submitted?: boolean;
  error?: string;
}

const TOKEN_TTL_MS = 60 * 60 * 1000;

export async function forgotPasswordAction(
  _prev: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "أدخل بريداً صحيحاً" };
  }
  const { email } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  // Always report success whether or not the account exists — don't leak
  // which emails are registered.
  if (user) {
    const token = randomUUID();
    await prisma.verificationToken.create({
      data: { identifier: email, token, expires: new Date(Date.now() + TOKEN_TTL_MS) },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    await sendPasswordResetEmail(email, `${baseUrl}/reset-password?token=${token}`);
  }

  return { submitted: true };
}
