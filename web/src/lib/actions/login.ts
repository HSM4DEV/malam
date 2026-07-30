"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { loginSchema } from "@/lib/validation/auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  // IP-scoped first (catches spraying many emails from one source) so this
  // still counts against garbage/malformed submissions, not just valid ones.
  const ip = await getClientIp();
  const allowedByIp = await checkRateLimit({
    key: `login:ip:${ip}`,
    limit: 20,
    windowMs: 10 * 60 * 1000,
  });
  if (!allowedByIp) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "تحقّق من البيانات المدخلة" };
  }

  // Email-scoped, tighter — stops credential stuffing against one account.
  const allowedByEmail = await checkRateLimit({
    key: `login:email:${parsed.data.email.toLowerCase()}`,
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!allowedByEmail) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    }
    throw error;
  }
  return {};
}
