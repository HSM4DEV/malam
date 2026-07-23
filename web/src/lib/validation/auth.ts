import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("أدخل بريداً إلكترونياً صحيحاً"),
  password: z.string().min(1, "أدخل كلمة المرور"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "أدخل الاسم الأول"),
  lastName: z.string().min(1, "أدخل اسم العائلة"),
  email: z.string().email("أدخل بريداً إلكترونياً صحيحاً"),
  password: z.string().min(8, "كلمة المرور ٨ أحرف على الأقل"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("أدخل بريداً إلكترونياً صحيحاً"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "كلمة المرور ٨ أحرف على الأقل"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
