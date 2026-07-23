"use server";

import { AuthError } from "next-auth";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signIn } from "@/auth";
import { registerSchema } from "@/lib/validation/auth";

export interface RegisterState {
  error?: string;
}

/** Buyer self-serve registration only — pro (developer/broker) applicants go through /register/apply instead. */
export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة" };
  }
  const { firstName, lastName, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "هذا البريد الإلكتروني مسجّل بالفعل" };
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({
    data: {
      name: `${firstName} ${lastName}`,
      email,
      passwordHash,
      role: "BUYER",
    },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    // NextAuth's signIn throws a NEXT_REDIRECT internally on success — only
    // an actual AuthError means sign-in itself failed after account creation.
    if (error instanceof AuthError) {
      return { error: "تم إنشاء الحساب، لكن تعذّر تسجيل الدخول تلقائياً. حاول تسجيل الدخول يدوياً." };
    }
    throw error;
  }
  return {};
}
